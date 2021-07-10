import { parse } from "dotenv";
import { readFileSync } from "fs";
import { cmd } from ".";
import { config, decrypt, logger } from "../util";
cmd
    .command("config:dec <key>", "Decrypt a config value in `configs/.env.<KIT_ENV>`.")
    .example("config:dec API_SECRET_KEY")
    .action(async (key) => {
    try {
        if (!config.masterKey) {
            throw new Error(`Missing 'KIT_MASTER_KEY' environment variable or 'configs/${config.env}.key' is empty/missing.`);
        }
        if (!/^([A-Z][A-Z0-9]*)(_[A-Z0-9]+)*$/.test(key)) {
            throw new Error("The key must be in uppercase SNAKE_CASE format, e.g. HTTP_HOST");
        }
        const configPath = `configs/.env.${config.env}`;
        const parsedConfig = parse(readFileSync(configPath, "utf-8"));
        if (!parsedConfig[key]) {
            throw new Error(`The '${key}' key is not defined in '${configPath}'.`);
        }
        console.log(decrypt(config.masterKey, parsedConfig[key]));
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
