/// <reference types="pino" />
export type { Config } from "./config";
export { CONFIG_ENC_SUFFIX } from "./config";
export declare const config: import("./config").Config;
export type { Logger } from "./logger";
export declare const logger: import("pino").Logger;
export type { DB } from "./db";
export declare const db: import("./db").DB;
export { encrypt, decrypt } from "./crypto";
