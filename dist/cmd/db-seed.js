import { cmd } from ".";
import { db, logger } from "../util";
cmd
    .command("db:seed", "Seed the database with minimal data.")
    .option("-t, --target", "The target database to work with.", "primary")
    .action(async (opts) => {
    try {
        if (!db[opts.target]) {
            throw new Error(`The '${opts.target}' database doesn't exist.`);
        }
        logger.info("Started seeding the database......");
        await db[opts.target]?.seed.run();
        logger.info("Started seeding the database...... SUCCESS");
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
    finally {
        db[opts.target]?.destroy();
    }
});
