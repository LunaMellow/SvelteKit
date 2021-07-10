import type { Server } from "../server";
import { getServer, closeProxyServer } from "../client/files/server";
import { cmd } from ".";
import { config, db, logger } from "../util";

cmd.command("server", "Start the HTTP server.").action(async () => {
  let server: Server;

  async function handler(sig: string) {
    console.log();
    logger.info(
      `The server is gracefully shutting down in ${config.serverGracefulShutdownTimeout}ms${
        sig ? ` upon receiving "${sig}"` : ""
      }...`
    );

    // eslint-disable-next-line
    // @ts-ignore
    server.server?.stop(async () => {
      closeProxyServer();

      // TODO: add more graceful shutdown handler.
      for (const key in db) {
        await db[key]?.destroy();
      }
    });
  }

  try {
    process.on("SIGINT", handler);
    process.on("SIGTERM", handler);
    process.on("SIGUSR2", handler);
    process.on("uncaughtException", handler);
    process.on("unhandledRejection", handler);

    if (process.env.NODE_ENV === "development") {
      server = await getServer().listen(config.port, config.host, () => {
        logger.info(`The server is listening on http://${config.host}:${config.port}...`);
      });
    } else {
      server = (await import(`${process.cwd()}/${config.outDir}/index.js`)).instance;
    }
  } catch (err) {
    logger.error(err);
  }
});
