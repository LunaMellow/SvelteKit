/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "http";
import type { Next, Polka } from "polka";
export interface Route {
    method: string;
    pattern: string;
    location: string;
}
export declare type Server = Polka;
export declare type ServerNext = Next;
export declare type HttpRequest = IncomingMessage;
export declare type HttpResponse = ServerResponse;
