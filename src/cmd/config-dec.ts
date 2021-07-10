import { parse } from "dotenv";
import { readFileSync } from "fs";
import { cmd } from ".";
import { CONFIG_ENC_SUFFIX, config, decrypt, logger } from "../util";

cmd
  .command("config:dec <key>", "Decrypt an encrypted config value in `configs/.env.<KIT_ENV>`.")
  .example("config:dec API_SECRET_KEY")
  .action((key) => {
    try {
      if (!config.masterKey) {
        throw new Error(
          `Missing 'KIT_MASTER_KEY' environment variable or 'configs/${config.env}.key' is empty/missing.`
        );
      }

      if (!/^([A-Z][A-Z0-9]*)(_[A-Z0-9]+)*$/.test(key)) {
        throw new Error("The key must be in uppercase SNAKE_CASE format, e.g. HTTP_HOST");
      }

      const configPath = `configs/.env.${config.env}`;
      const parsedConfig = parse(readFileSync(configPath, "utf-8"));

      if (!parsedConfig[key]) {
        throw new Error(`The '${key}' key is not defined in '${configPath}'.`);
      }

      if (!parsedConfig[key].trim().endsWith(CONFIG_ENC_SUFFIX)) {
        throw new Error(`The '${key}' key defined in '${configPath}' is not an encrypted key.`);
      }

      console.log(
        decrypt(config.masterKey, parsedConfig[key].replace(CONFIG_ENC_SUFFIX, "").trim())
      );
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
