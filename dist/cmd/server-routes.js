import { default as Table } from "cli-table";
import { cmd } from ".";
import { logger } from "../util";
import { getRoutes } from "../server";
cmd.command("server:routes", "List all the server routes.").action(async () => {
    try {
        const table = new Table({
            head: ["Route", "Location"],
            colWidths: [80, 80],
        });
        for (const route of await getRoutes()) {
            table.push([`${route.method.toUpperCase()} ${route.pattern}`, route.location]);
        }
        console.log();
        console.log(table.toString());
        console.log();
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
