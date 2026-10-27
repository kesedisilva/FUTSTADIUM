import { createHmac, timingSafeEqual } from "node:crypto";

const SECRET = process.env.SESSION_SECRET ?? "caderno-de-jogos-local";

function sign(value) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function serializeSession(userId) {
  const value = String(userId);
  return `${value}.${sign(value)}`;
}

export function parseSession(raw) {
  const text = String(raw ?? "");
  const separator = text.lastIndexOf(".");
  if (separator < 1) {
    return null;
  }

  const value = text.slice(0, separator);
  const signature = Buffer.from(text.slice(separator + 1), "hex");
  const expected = Buffer.from(sign(value), "hex");

  if (signature.length !== expected.length) {
    return null;
  }
  if (!timingSafeEqual(signature, expected)) {
    return null;
  }

  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
