import colors from "ansi-colors";
import { randomBytes } from "crypto";
import { parse } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { cmd } from ".";
import { CONFIG_ENC_SUFFIX, config, decrypt, encrypt, logger } from "../util";

cmd
  .command(
    "config:secret:rotate <oldMasterKey>",
    "Decrypt the encrypted config with the old master key and re-encrypt with newly generated master key. (only for NODE_ENV=development)"
  )
  .action((oldMasterKey) => {
    try {
      const keyPath = `configs/${config.env}.key`;
      const configPath = `configs/.env.${config.env}`;
      const parsedConfig = parse(readFileSync(configPath, "utf-8"));
      const newMasterKey = randomBytes(16).toString("hex");

      let newConfig = "";
      let prevK = "";
      for (const k of Object.keys(parsedConfig).sort()) {
        if (parsedConfig[k].trim().endsWith(CONFIG_ENC_SUFFIX)) {
          const decryptedText = decrypt(oldMasterKey, parsedConfig[k]);
          parsedConfig[k] = `${encrypt(newMasterKey, decryptedText)}${CONFIG_ENC_SUFFIX}`;
        }

        if (prevK !== "" && prevK[0] !== k[0]) {
          newConfig += "\n";
        }

        prevK = k;
        newConfig += `${k}=${parsedConfig[k]}\n`;
      }

      writeFileSync(configPath, newConfig, { encoding: "utf-8" });
      writeFileSync(keyPath, newMasterKey, { encoding: "utf-8" });
      console.log(
        `Successfully updated '${configPath}' with the new master key ${colors.bold.whiteBright.bgGreen(
          newMasterKey
        )}!`
      );
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  });
