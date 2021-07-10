import { execSync } from "child_process";
import { cmd, enhancedProcessEnv } from ".";
import { db, logger } from "../util";

async function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

cmd
  .command("setup", "Setup the Docker Compose cluster with DB migrate/seed.")
  .option("-f", "The compose configuration file path.", ".docker/docker-compose.yml")
  .action(async (opts) => {
    try {
      execSync(`docker compose -f ${opts.f} up -d`, {
        env: enhancedProcessEnv(import.meta),
        stdio: "inherit",
      });

      for (const dbName in db) {
        if (!db[dbName]) continue;

        const timeout = 3;
        const dbReady = false;

        while (!dbReady) {
          try {
            const result = await db[dbName]?.raw("select 1+1 as result");

            if (result) break;
            logger.info(`Wait ${timeout}s for '${dbName}' database to be ready...`);
            await sleep(timeout * 1000);
          } catch (err) {
            logger.info(`Wait ${timeout}s for '${dbName}' database to be ready...`);
            await sleep(timeout * 1000);
          }
        }

        logger.info(`Started migrating the '${dbName}' database...`);
        await db[dbName]?.migrate.latest();
        logger.info(`Started migrating the '${dbName}' database... SUCCESS`);

        logger.info(`Started seeding the '${dbName}' database...`);
        await db[dbName]?.seed.run();
        logger.info(`Started seeding the '${dbName}' database... SUCCESS`);

        await db[dbName]?.destroy();
      }
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
