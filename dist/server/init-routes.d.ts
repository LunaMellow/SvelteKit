import type { Server } from "./server";
export declare const HTTP_METHODS: string[];
export declare function getFilenames(): Promise<string[]>;
export default function initRoutes(server: Server): Promise<void>;
