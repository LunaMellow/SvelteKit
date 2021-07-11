import { dirname } from "dirname-filename-esm";
import { basename } from "path";
import sade from "sade";
import tinyGlob from "tiny-glob";
import { config, logger } from "../util";

export { enhancedProcessEnv, pkgDir } from "../util/process";
export type Cmd = sade.Sade;

export const cmd = sade("./app");

export async function bootstrap(): Promise<void> {
  await loadAppCommands();
  cmd.parse(process.argv);
}

export async function loadAppCommands(): Promise<void> {
  try {
    const __dirname = dirname(import.meta);
    const builtinFiles = await tinyGlob(`${__dirname}/**/*.js`, {
      absolute: true,
      filesOnly: true,
    });

    const NON_PROD_CMDS = [
      "build",
      "config-secret-rotate",
      "dev",
      "dk-build",
      "gen-migration",
      "gen-secret",
      "lint-staged",
      "lint",
      "test-unit",
    ];

    for (const f of builtinFiles) {
      if (
        (process.env.NODE_ENV === "production" &&
          NON_PROD_CMDS.indexOf(basename(f.replace(/\.(js|ts)/, ""))) > -1) ||
        f.endsWith("index.js")
      )
        continue;
      await import(f);
    }

    const appFiles = await tinyGlob(
      `${process.env.NODE_ENV === "development" ? config.rootDir : config.outDir}/cmd/**/*.${
        process.env.NODE_ENV === "development" ? "ts" : "js"
      }`,
      {
        absolute: true,
        filesOnly: true,
      }
    );

    for (const f of appFiles) {
      await import(f);
    }
  } catch (err) {
    logger.warn(err.message);
  }
}
