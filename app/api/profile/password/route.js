import db from "../../../../lib/db.js";
import { hashPassword } from "../../../../lib/password.js";
import { checkCurrentPassword, checkNewPassword } from "../../../../lib/passwordRules.js";
import { getCurrentUser } from "../../../../lib/session.js";

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
  }

  const body = await request.json();
  const errors = [];

  const stored = db
    .prepare("SELECT password_hash AS passwordHash FROM users WHERE id = ?")
    .get(user.id);

  checkCurrentPassword(body.currentPassword, stored.passwordHash, errors);
  const password = checkNewPassword(body.newPassword, body.newPasswordConfirmation, errors);

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(password),
    user.id,
  );

  return new Response(null, { status: 204 });
}
