import { randomBytes } from "crypto";
import { cmd } from ".";
import { logger } from "../util";

cmd
  .command(
    "gen:secret",
    "Generate a cryptographically secure secret key. (only for NODE_ENV=development)"
  )
  .option("-s, --size", "The key's byte size. Use 16 for the master key.", 64)
  .action((opts) => {
    try {
      console.log(randomBytes(opts.size).toString("hex"));
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
