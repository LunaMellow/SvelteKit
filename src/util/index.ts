export type { Config } from "./config";
export { CONFIG_ENC_SUFFIX } from "./config";
import { getConfig } from "./config";
export const config = getConfig();

export type { Logger } from "./logger";
import { getLogger } from "./logger";
export const logger = getLogger();

export type { DB } from "./db";
import { getDB } from "./db";
export const db = getDB();

export { encrypt, decrypt } from "./crypto";
