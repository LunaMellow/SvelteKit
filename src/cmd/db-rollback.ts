import { cmd } from ".";
import { db, logger } from "../util";

cmd
  .command("db:rollback", "Rollback the database schema to previous version.")
  .example("db:rollback")
  .example("db:rollback --target primary")
  .option("--target", "The target database to work with.", "primary")
  .action(async (opts) => {
    try {
      if (!db[opts.target]) {
        throw new Error(`The '${opts.target}' database doesn't exist.`);
      }

      logger.info(
        `Started rolling back the '${opts.target}' database schema to previous version...`
      );
      await db[opts.target]?.migrate.rollback();
      logger.info(
        `Started rolling back the '${opts.target}' database schema to previous version... SUCCESS`
      );
    } catch (err) {
      logger.error(err);
      process.exit(1);
    } finally {
      db[opts.target]?.destroy();
    }
  });
