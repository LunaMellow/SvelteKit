import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-ctr";
const IV_SIZE = 16;

export function encrypt(secret: string, text: string): string {
  const iv = randomBytes(IV_SIZE);
  const cipher = createCipheriv(ALGO, secret, iv);

  return `${Buffer.concat([cipher.update(text), cipher.final()]).toString("hex")}${iv.toString(
    "hex"
  )}`;
}

export function decrypt(secret: string, encText: string): string {
  const size = IV_SIZE * 2;
  const decipher = createDecipheriv(ALGO, secret, Buffer.from(encText.slice(-size), "hex"));

  return Buffer.concat([
    decipher.update(Buffer.from(encText.slice(0, encText.length - size), "hex")),
    decipher.final(),
  ]).toString();
}
