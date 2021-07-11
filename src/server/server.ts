import type { IncomingMessage, ServerResponse } from "http";
import type { Next, Polka } from "polka";

export interface Route {
  method: string;
  pattern: string;
  location: string;
}
export type Server = Polka;
export type ServerNext = Next;
export type HttpRequest = IncomingMessage;
export type HttpResponse = ServerResponse;
