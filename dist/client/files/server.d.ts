import type { Server } from "../../server";
export declare function getServer({ render }?: {
    render: () => void;
}): Server;
export declare function closeProxyServer(): void;
