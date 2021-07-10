import type { IncomingMessage, ServerResponse } from "http";
import type { Next, Polka } from "polka";

export interface Route {
  method: string;
  path: string;
}
export type Routes = { [key: string]: Route };
export type Server = Polka;
export type ServerNext = Next;
export type HttpRequest = IncomingMessage;
export type HttpResponse = ServerResponse;
