import { config } from "dotenv";
import { existsSync, readFileSync } from "fs";
import { decrypt } from "./crypto.js";
/**
 * Returns the application config.
 *
 * @returns The application config.
 */
export function getConfig() {
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
    }
    catch (err) {
        // eslint-disable-next-line
        console.log(err);
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
        serverGracefulShutdownTimeout: parseInt(process.env.KIT_SERVER_GRACEFUL_SHUTDOWN_TIMEOUT || "5000"),
        serverPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/server`,
        signedCookiesSecret: process.env.KIT_SIGNED_COOKIES_SECRET || "",
        workerPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/worker`,
    };
}
export const CONFIG_ENC_SUFFIX = " #encrypted";
export function decryptEnvVar(masterKey) {
    if (!masterKey) {
        return;
    }
    Object.keys(process.env).forEach((key) => {
        if (process.env[key]?.trim().endsWith(CONFIG_ENC_SUFFIX)) {
            const val = process.env[key]?.replace(CONFIG_ENC_SUFFIX, "").trim();
            if (val) {
                process.env[key] = decrypt(masterKey, val);
            }
        }
    });
}
