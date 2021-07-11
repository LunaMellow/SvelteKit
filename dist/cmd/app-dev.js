import colors from "ansi-colors";
import { exec } from "child_process";
import nodemon from "nodemon";
import tinyGlob from "tiny-glob";
import { cmd, enhancedProcessEnv } from ".";
import { config, logger } from "../util";
const SERVER_TAG = colors.bold.whiteBright.bgBlue(" server ");
let server;
const CLIENT_TAG = colors.bold.whiteBright.bgGreen(" client ");
let client;
cmd
    .command("app:dev", "Start the app server/client/worker for development. (only for NODE_ENV=development)")
    .option("--inspect", "Start the V8 inspector for the server/worker. By default, the inspector port for server is 9229 and for worker is 9230 which can be modified by passing in a different port number.", 9229)
    .example("start")
    .example("start --inspect=9229")
    .action(async (opts) => {
    try {
        const optsArr = [`--host=${config.host}`, `--port=${parseInt(config.port) + 1}`];
        client = exec(`svelte-kit dev ${optsArr.join(" ")}`, {
            env: enhancedProcessEnv(import.meta),
        });
        client.stdout?.on("data", (data) => {
            process.stdout.write(data
                .split("\n")
                .map((line) => (line ? `${CLIENT_TAG}  ${line.trimEnd()}\n` : ""))
                .join(""));
        });
        client.stderr?.on("data", (data) => {
            process.stderr.write(data
                .split("\n")
                .map((line) => (line ? `${CLIENT_TAG}  ${line.trimEnd()}\n` : ""))
                .join(""));
        });
        const inspectPort = parseInt(opts.inspect);
        server = nodemon({
            delay: 0.5,
            env: {
                FORCE_COLOR: "1",
                NODE_ENV: "development",
                ...(opts.inspect
                    ? {
                        NODE_OPTIONS: `--inspect=${inspectPort}`,
                    }
                    : {}),
            },
            exec: "./app server",
            ext: "bmp,css,gif,htm,html,ico,js,jpg,jpeg,json,png,svelte,svg,svgz,ts,txt,webp,xhtml,xml,yml,yaml",
            ignore: [".git", "node_modules", "*.test.ts", "*.spec.ts"],
            pollingInterval: 500,
            stdout: false,
            watch: [
                ...(await tinyGlob("configs/**/*", { dot: true, filesOnly: true })),
                config.serverPath,
            ],
        });
        server.on("stdout", (data) => {
            process.stdout.write(data
                .toString()
                .trim()
                .split("\n")
                .map((line) => (line ? `${SERVER_TAG}  ${line.trimEnd()}\n` : ""))
                .join(""));
        });
        server.on("stderr", (data) => {
            process.stderr.write(data
                .toString()
                .trim()
                .split("\n")
                .map((line) => (line ? `${SERVER_TAG}  ${line.trimEnd()}\n` : ""))
                .join(""));
        });
        server.on("restart", () => {
            // This is needed due to dotenv only loads the `*.env` values into `process.env` if the
            // environment variable isn't set yet.
            Object.keys(process.env).forEach((key) => {
                if (key.startsWith("KIT_")) {
                    delete process.env[key];
                }
            });
        });
        server.on("quit", () => {
            // To prettify the console.
            console.log();
            process.exit(0);
        });
        process.on("SIGINT", gracefulShutdown(client));
        process.on("SIGTERM", gracefulShutdown(client));
        process.on("uncaughtException", gracefulShutdown(client));
        process.on("unhandledRejection", gracefulShutdown(client));
    }
    catch (err) {
        gracefulShutdown(client);
        logger.error(err);
        process.exit(1);
    }
});
function gracefulShutdown(...processes) {
    return () => {
        for (let i = 0; i < processes.length; i++) {
            if (processes[i] && !processes[i].killed) {
                processes[i].kill("SIGTERM");
            }
        }
        server.emit("quit");
    };
}
