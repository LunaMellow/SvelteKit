import type { Config } from "./config";

describe("config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.mock("./logger");
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test("returns the default value", () => {
    process.env.NODE_ENV = "development";
    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}`);
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      env: "development",
      envDir: "configs",
      host: "0.0.0.0",
      loggerRedactPaths: [],
      masterKey: "",
      outDir: "dist",
      port: "3000",
      rootDir: "src",
      serverGracefulShutdownTimeout: 5000,
      serverPath: "src/server",
      signedCookiesSecret: "",
      workerPath: "src/worker",
    });

    cwdSpy.mockRestore();
  });

  test("returns the overriden environment variables", () => {
    process.env.NODE_ENV = "production";
    process.env.HOST = "localhost";
    process.env.PORT = "5000";
    process.env.APP_DB_URI_PRIMARY =
      "65ca46f628e39c3b8359b88f803e569774a03aea89f057e7a078b41e7bb797dd082243f2344e2e36a78270182df80ff26db4b2662449a4 #encrypted";
    process.env.APP_DB_URI_SECONDARY =
      "65ca46f628e39c3b8359b88f803e569774a03aea89f057e7a078b41e7bb797dd082243f2344e2e36a78270182df80ff26db4b2662449a4";
    process.env.KIT_MASTER_KEY = "1aed9d5fcb8dff40d3dde43024177621";
    process.env.KIT_LOGGER_REDACT_PATHS = "user.password,card.cvv";
    process.env.KIT_SERVER_GRACEFUL_SHUTDOWN_TIMEOUT = "10000";
    process.env.KIT_SIGNED_COOKIES_SECRET =
      "a7ab2500d4d7a52e66e07b883126773c8b147da8e4190c2b713fea1bbf47588dfbf1eac617d495e1430cc27cd1cb09af0827df7f58b68be6f69c2ebd63767813";
    const cwdSpy = jest.spyOn(process, "cwd").mockReturnValue(`${__dirname}/__fixtures__`);
    const { getConfig } = require("./config");
    const config: Config = getConfig();

    expect(config).toEqual({
      env: "development",
      envDir: "configs",
      host: "localhost",
      loggerRedactPaths: ["user.password", "card.cvv"],
      masterKey: "1aed9d5fcb8dff40d3dde43024177621",
      outDir: "build",
      port: "5000",
      rootDir: "client",
      serverGracefulShutdownTimeout: 10000,
      serverPath: "build/server",
      signedCookiesSecret:
        "a7ab2500d4d7a52e66e07b883126773c8b147da8e4190c2b713fea1bbf47588dfbf1eac617d495e1430cc27cd1cb09af0827df7f58b68be6f69c2ebd63767813",
      workerPath: "build/worker",
    });

    expect(process.env.APP_DB_URI_PRIMARY).toBe("mysql://main:whatever@0.0.0.0:3306/main");
    expect(process.env.APP_DB_URI_SECONDARY).toBe(
      "65ca46f628e39c3b8359b88f803e569774a03aea89f057e7a078b41e7bb797dd082243f2344e2e36a78270182df80ff26db4b2662449a4"
    );

    cwdSpy.mockRestore();
  });
});
