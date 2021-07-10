import sade from "sade";
export { enhancedProcessEnv, pkgDir } from "../util/process";
export declare type Cmd = sade.Sade;
export declare const cmd: sade.Sade;
export declare function bootstrap(): Promise<void>;
export declare function loadAppCommands(): Promise<void>;
