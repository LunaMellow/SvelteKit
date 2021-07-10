/// <reference types="node" />
import type { IncomingMessage, ServerResponse } from "http";
import type { Next, Polka } from "polka";
export interface Route {
    method: string;
    path: string;
}
export declare type Routes = {
    [key: string]: Route;
};
export declare type Server = Polka;
export declare type ServerNext = Next;
export declare type HttpRequest = IncomingMessage;
export declare type HttpResponse = ServerResponse;
