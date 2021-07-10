describe("crypto", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test("should encrypt and decrypt fine", () => {
    const { encrypt, decrypt } = require("./crypto");
    const secret = "1aed9d5fcb8dff40d3dde43024177621";
    const text = "foobar";

    const encText = encrypt(secret, text);
    expect(encText.length).toBeGreaterThan(0);
    expect(decrypt(secret, encText)).toBe(text);
  });
});
