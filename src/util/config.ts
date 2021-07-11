import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { decrypt } from "./crypto.js";

export const CONFIG_ENC_SUFFIX = " #encrypted";

/**
 * Defines the application configuration that follows [12-factor application](https://12factor.net/) which we rely on
 * the environment variable to determine which application config to load, i.e.
 * `configs/.env.<KIT_ENV>`.
 */
export interface Config {
  /**
   * Maps to the `KIT_ENV` environment variable that determines which application config to load, i.e.
   * `configs/.env.<KIT_ENV>`. By default, it is `"development"`.
   */
  env: string;

  /**
   * The directory from which `.env` files are loaded.
   */
  envDir: string;

  /**
   * Maps to the `HOST` environment variable that indicates the host the server is listening on.
   * By default, it is `"0.0.0.0"`.
   */
  host: string;

  /**
   * Maps to the `KIT_LOGGER_REDACT_PATHS` environment variable that determines which paths of the object to redact
   * when being passed to the application's logger. By default, it is `""`.
   *
   * For example, if you run the application with the below:
   *
   * ```sh
   * # Assuming your `configs/.env.development` is as below:
   * #
   * # KIT_LOGGER_REDACT_PATHS=user.password,user.card_number
   * ```
   *
   * Example:
   * ```
   * import { logger } from "@appist/kit";
   *
   * logger.info({
   *    user: {
   *      card_number: "1234-5678-1234-5678",
   *      password: "whatever",
   *      username: "John Doe"
   *    }
   * });
   * ```
   *
   * Output:
   * ```json
   * {
   *    user: {
   *      card_number: "[redacted]",
   *      password: "[redacted]",
   *      username: "John Doe"
   *    }
   * }
   * ```
   */
  loggerRedactPaths: string[];

  /**
   * Maps to the `KIT_MASTER_KEY` environment variable that can be used to encrypt/decrypt the config values. In
   * addition, it can also refer to the value in `configs/<KIT_ENV>.key`. By default, it is `""`.
   */
  masterKey: string;

  /**
   * Indicates the directory/folder to emit the compiled JS and Svelte files for production deployment. The value
   * will always be `${compilerOptions.outDir}`.
   */
  outDir: string;

  /**
   * Maps to the `PORT` environment variable that indicates the port the server is listening on.
   * By default, it is `"3000"`.
   */
  port: string;

  /**
   * Indicates the root directory to the source code.
   *
   * When `NODE_ENV` equals to `development`, it will be `${compilerOptions.rootDir}`.
   *
   * > Note: If `compilerOptions.rootDir` in `tsconfig.json` isn't defined, it will be `src` by default.
   *
   * When `NODE_ENV` equals to `production`, it will be `${compilerOptions.outDir}` in
   * `tsconfig.json`.
   *
   * > Note: If `compilerOptions.outDir` in `tsconfig.json` isn't defined, it will be `dist` by default.
   */
  rootDir: string;

  /**
   * Maps to the `KIT_SERVER_GRACEFUL_SHUTDOWN_TIMEOUT` environment variable that indicates the graceful shutdown
   * timeout in milliseconds. By default, it is `5000`.
   */
  serverGracefulShutdownTimeout: number;

  /**
   * Maps to the `KIT_SERVER_PATH` environment variable that indicates the path to server routes.
   * By default, it is `"<rootDir>/server"`.
   */
  serverPath: string;

  /**
   * Maps to the `KIT_SIGNED_COOKIES_SECRET` environment variable that is used to sign/unsign the cookies value.
   */
  signedCookiesSecret: string;

  /**
   * Maps to the `KIT_WORKER_PATH` environment variable that indicates the path to worker tasks.
   * By default, it is `"<rootDir>/worker"`.
   */
  workerPath: string;
}

/**
 * Returns the application config.
 *
 * @returns The application config.
 */
export function getConfig(): Config {
  if (!process.env.KIT_ENV) {
    process.env.KIT_ENV = "development";
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }

  let rootDir = "src";
  let outDir = "dist";
  let masterKey = process.env.KIT_MASTER_KEY?.trim() || "";
  const cwd = process.cwd();
  const envDir = "configs";
  const configPath = `${cwd}/${envDir}/.env.${process.env.KIT_ENV}`;

  try {
    const tsconfigPath = `${cwd}/tsconfig.json`;
    if (existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf-8"));

      if (tsconfig?.compilerOptions?.outDir) {
        outDir = tsconfig?.compilerOptions?.outDir.replace(/^\.\//, "");
      }

      if (tsconfig?.compilerOptions?.rootDir) {
        rootDir = tsconfig?.compilerOptions?.rootDir.replace(/^\.\//, "");
      }
    }

    config({
      path: configPath,
    });

    const masterKeyPath = `${cwd}/configs/${process.env.KIT_ENV}.key`;
    if (!masterKey && existsSync(masterKeyPath)) {
      const masterKeyFromKeyFile = readFileSync(masterKeyPath, "utf-8").trim();

      if (masterKeyFromKeyFile) {
        masterKey = masterKeyFromKeyFile;
      }
    }

    decryptEnvVar(masterKey);
  } catch (err) {
    // eslint-disable-next-line
    console.error(err);
  }

  return {
    env: process.env.KIT_ENV,
    envDir,
    host: process.env.HOST || "0.0.0.0",
    loggerRedactPaths: process.env.KIT_LOGGER_REDACT_PATHS
      ? process.env.KIT_LOGGER_REDACT_PATHS.split(",")
      : [],
    masterKey: masterKey || "",
    outDir,
    port: process.env.PORT || "3000",
    rootDir,
    serverGracefulShutdownTimeout: parseInt(
      process.env.KIT_SERVER_GRACEFUL_SHUTDOWN_TIMEOUT || "5000"
    ),
    serverPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/server`,
    signedCookiesSecret: process.env.KIT_SIGNED_COOKIES_SECRET || "",
    workerPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/worker`,
  };
}

export default getConfig();

export function decryptEnvVar(masterKey: string): void {
  if (!masterKey) {
    return;
  }

  Object.keys(process.env).forEach((key) => {
    if (process.env[key]?.trim().endsWith(CONFIG_ENC_SUFFIX)) {
      const val = process.env[key]?.replace(CONFIG_ENC_SUFFIX, "").trim();

      if (val) {
        try {
          process.env[key] = decrypt(masterKey, val);
        } catch (err) {
          console.error(
            `Unable to decrypt '${key}' defined in 'configs/.env.${process.env.KIT_ENV}'.`
          );
        }
      }
    }
  });
}
