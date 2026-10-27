import { createHash, randomBytes } from "node:crypto";
import db from "./db.js";

export const VALID_FOR_MS = 30 * 60 * 1000;

function digest(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

export function createResetToken(userId, validForMs = VALID_FOR_MS) {
  db.prepare(
    "UPDATE password_resets SET used_at = datetime('now', 'localtime') WHERE user_id = ? AND used_at IS NULL",
  ).run(userId);

  const token = randomBytes(32).toString("hex");

  db.prepare(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
  ).run(userId, digest(token), Date.now() + validForMs);

  return token;
}

export function consumeResetToken(token) {
  if (!token) {
    return null;
  }

  const row = db
    .prepare(
      "SELECT id, user_id AS userId, expires_at AS expiresAt FROM password_resets WHERE token_hash = ? AND used_at IS NULL",
    )
    .get(digest(token));

  if (!row || row.expiresAt < Date.now()) {
    return null;
  }

  db.prepare(
    "UPDATE password_resets SET used_at = datetime('now', 'localtime') WHERE id = ?",
  ).run(row.id);

  return row.userId;
}

export function findUserByEmail(email) {
  const row = db
    .prepare("SELECT id, name, email FROM users WHERE email = ?")
    .get(String(email ?? "").trim().toLowerCase());
  return row ? { ...row } : null;
}

export function recordEmail(recipient, subject, body, link) {
  db.prepare(
    "INSERT INTO emails (recipient, subject, body, link) VALUES (?, ?, ?, ?)",
  ).run(recipient, subject, body, link);
}

export function listEmails() {
  return db
    .prepare("SELECT * FROM emails ORDER BY id DESC LIMIT 20")
    .all()
    .map((row) => ({ ...row }));
}
