import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(plain, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(plain, stored) {
  const [salt, derived] = String(stored ?? "").split(":");
  if (!salt || !derived) {
    return false;
  }

  const expected = Buffer.from(derived, "hex");
  if (expected.length !== KEY_LENGTH) {
    return false;
  }

  return timingSafeEqual(expected, scryptSync(plain, salt, KEY_LENGTH));
}
