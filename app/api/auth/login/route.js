import db from "../../../../lib/db.js";
import { verifyPassword } from "../../../../lib/password.js";
import { startSession } from "../../../../lib/session.js";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  const user = db
    .prepare("SELECT id, password_hash AS passwordHash FROM users WHERE email = ?")
    .get(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ errors: ["E-mail ou senha incorretos."] }, { status: 401 });
  }

  await startSession(user.id);
  return Response.json({ id: user.id });
}
