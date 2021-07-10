export { CONFIG_ENC_SUFFIX } from "./config";
import { getConfig } from "./config";
export const config = getConfig();
import { getLogger } from "./logger";
export const logger = getLogger();
import { getDB } from "./db";
export const db = getDB();
export { encrypt, decrypt } from "./crypto";
