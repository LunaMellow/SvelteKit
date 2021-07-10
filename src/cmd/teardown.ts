import { execSync } from "child_process";
import { cmd, enhancedProcessEnv } from ".";
import { logger } from "../util";

cmd
  .command("teardown", "Destroy the Docker Compose cluster.")
  .option("-f", "The compose configuration file path", ".docker/docker-compose.yml")
  .action(async (opts) => {
    try {
      execSync(`docker compose -f ${opts.f} down --remove-orphans`, {
        env: enhancedProcessEnv(import.meta),
        stdio: "inherit",
      });
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
