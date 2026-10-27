import { cookies } from "next/headers";
import db from "./db.js";
import { parseSession, serializeSession } from "./sessionToken.js";

const COOKIE = "caderno_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getCurrentUser() {
  const store = await cookies();
  const id = parseSession(store.get(COOKIE)?.value);
  if (!id) {
    return null;
  }

  const row = db
    .prepare("SELECT id, name, email, team_id AS teamId FROM users WHERE id = ?")
    .get(id);
  return row ? { ...row } : null;
}

export async function startSession(userId) {
  const store = await cookies();
  store.set(COOKIE, serializeSession(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
