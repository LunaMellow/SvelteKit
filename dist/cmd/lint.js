import { execSync } from "child_process";
import { cmd, enhancedProcessEnv } from ".";
import { logger } from "../util";
cmd
    .command("lint", "Lint/Format the code with ESLint and Prettier. (only for NODE_ENV=development)")
    .option("--fix", "Fix the errors/warnings emitted by ESLint/Prettier.")
    .action(async (opts) => {
    try {
        const execSyncOpts = {
            env: enhancedProcessEnv(import.meta, false),
            stdio: "inherit",
        };
        execSync("svelte-check", execSyncOpts);
        if (opts.fix) {
            execSync("prettier --write .", execSyncOpts);
            execSync("eslint --fix .", execSyncOpts);
            return;
        }
        execSync("prettier --check .", execSyncOpts);
        execSync("eslint .", execSyncOpts);
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
