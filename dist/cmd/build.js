import { execSync } from "child_process";
import { rmSync } from "fs";
import { resolve } from "path";
import { cmd, enhancedProcessEnv } from ".";
import { config, logger } from "../util";
cmd
    .command("build", "Build the app server/client/worker for deployment. (only for NODE_ENV=development)")
    .action(() => {
    try {
        rmSync(resolve(config.outDir), {
            recursive: true,
            force: true,
        });
        execSync("svelte-kit build", { env: enhancedProcessEnv(import.meta), stdio: "inherit" });
        execSync("tsc", { env: enhancedProcessEnv(import.meta, false), stdio: "inherit" });
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
