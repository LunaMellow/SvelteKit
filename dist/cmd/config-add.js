import { parse } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { promisify } from "util";
import { cmd } from ".";
import { config, CONFIG_ENC_SUFFIX, encrypt, logger } from "../util";
cmd
    .command("config:add <key> <value>", "Add/Encrypt a new config value into `configs/.env.<KIT_ENV>`. Prefix the key with `VITE_` if the config is to be exposed in the client.")
    .example("config:add API_URL http://api.example.com")
    .example("config:add API_SECRET_KEY secretkey --enc=true")
    .example("config:add VITE_API_URL http://api.example.com")
    .option("--enc", "Indicate if the config value should be encrypted.", false)
    .action(async (key, value, opts) => {
    try {
        if (!/^([A-Z][A-Z0-9]*)(_[A-Z0-9]+)*$/.test(key)) {
            throw new Error("The key must be in uppercase SNAKE_CASE format, e.g. HTTP_HOST");
        }
        let valueToWrite = value;
        const configPath = `configs/.env.${config.env}`;
        const parsedConfig = parse(readFileSync(configPath, "utf-8"));
        if (parsedConfig[key]) {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            const question = promisify(rl.question).bind(rl);
            const answer = await question(`'${key}' key already existed in '${configPath}', do you want to overwrite? (y/N): `);
            // eslint-disable-next-line
            // @ts-ignore
            if (answer.trim().toLowerCase() !== "y") {
                process.exit(0);
            }
            rl.close();
        }
        if (opts.enc) {
            if (!config.masterKey) {
                throw new Error(`Missing 'KIT_MASTER_KEY' environment variable or 'configs/${config.env}.key' is empty/missing.`);
            }
            valueToWrite = `${encrypt(config.masterKey, value)}${CONFIG_ENC_SUFFIX}`;
        }
        parsedConfig[key] = valueToWrite;
        let newConfig = "";
        let prevK = "";
        for (const k of Object.keys(parsedConfig).sort()) {
            if (prevK !== "" && prevK[0] !== k[0]) {
                newConfig += "\n";
            }
            prevK = k;
            newConfig += `${k}=${parsedConfig[k]}\n`;
        }
        writeFileSync(configPath, newConfig, { encoding: "utf-8" });
        console.log(`Successfully added the value for '${key}' key into '${configPath}'!`);
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
});
