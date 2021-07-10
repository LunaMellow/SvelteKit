import { config } from "dotenv";
import { readFileSync } from "fs";
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
    const cwd = process.cwd();
    let rootDir = "src";
    let outDir = "dist";
    try {
        const tsconfig = JSON.parse(readFileSync(`${cwd}/tsconfig.json`, "utf-8"));
        if (tsconfig?.compilerOptions?.outDir)
            outDir = tsconfig?.compilerOptions?.outDir.replace(/^\.\//, "");
        if (tsconfig?.compilerOptions?.rootDir)
            rootDir = tsconfig?.compilerOptions?.rootDir.replace(/^\.\//, "");
    }
    catch (err) {
        // eslint-disable-next-line
    }
    const envDir = "configs";
    const configPath = `${cwd}/${envDir}/.env.${process.env.KIT_ENV}`;
    config({
        path: configPath,
    });
    return {
        env: process.env.KIT_ENV,
        envDir,
        host: process.env.HOST || "0.0.0.0",
        loggerRedactPaths: process.env.KIT_LOGGER_REDACT_PATHS
            ? process.env.KIT_LOGGER_REDACT_PATHS.split(",")
            : [],
        outDir,
        port: process.env.PORT || "3000",
        rootDir,
        serverGracefulShutdownTimeout: parseInt(process.env.KIT_SERVER_GRACEFUL_SHUTDOWN_TIMEOUT || "5000"),
        serverPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/server`,
        signedCookiesSecret: process.env.KIT_SIGNED_COOKIES_SECRET || "",
        workerPath: `${process.env.NODE_ENV === "development" ? rootDir : outDir}/worker`,
    };
}
