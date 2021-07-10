export type { Config } from "./config";
import { getConfig } from "./config";
export const config = getConfig();

export type { Logger } from "./logger";
import { getLogger } from "./logger";
export const logger = getLogger();

export type { DB } from "./db";
import { getDB } from "./db";
export const db = getDB();
