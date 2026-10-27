import db from "../../../../lib/db.js";
import { teamExists } from "../../../../lib/matches.js";
import { hashPassword } from "../../../../lib/password.js";
import { checkNewPassword } from "../../../../lib/passwordRules.js";
import { startSession } from "../../../../lib/session.js";
import { requiredId, requiredText } from "../../../../lib/validation.js";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request) {
  const body = await request.json();
  const errors = [];

  const name = requiredText(body.name, "O nome", errors);
  const email = requiredText(body.email, "O e-mail", errors).toLowerCase();
  const password = checkNewPassword(body.password, body.passwordConfirmation, errors);
  const teamId = requiredId(body.teamId, "O time do coração", errors);

  if (email && !EMAIL.test(email)) {
    errors.push("Informe um e-mail válido.");
  }
  if (email && db.prepare("SELECT id FROM users WHERE email = ?").get(email)) {
    errors.push("Já existe uma conta com esse e-mail.");
  }
  if (teamId !== null && !teamExists(teamId)) {
    errors.push("Time inválido.");
  }

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const result = db
    .prepare("INSERT INTO users (name, email, password_hash, team_id) VALUES (?, ?, ?, ?)")
    .run(name, email, hashPassword(password), teamId);

  const id = Number(result.lastInsertRowid);
  await startSession(id);
  return Response.json({ id }, { status: 201 });
}
