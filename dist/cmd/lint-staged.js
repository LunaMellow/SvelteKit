import { execSync } from "child_process";
import { cmd, enhancedProcessEnv } from ".";
import { logger } from "../util";
cmd
    .command("lint:staged", "Run linters against staged git files. (only for NODE_ENV=development)")
    .action(async () => {
    try {
        execSync("lint-staged", { env: enhancedProcessEnv(import.meta), stdio: "inherit" });
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
