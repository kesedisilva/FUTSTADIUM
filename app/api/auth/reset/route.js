import db from "../../../../lib/db.js";
import { hashPassword } from "../../../../lib/password.js";
import { consumeResetToken } from "../../../../lib/passwordReset.js";
import { checkNewPassword } from "../../../../lib/passwordRules.js";

export async function POST(request) {
  const body = await request.json();
  const errors = [];
  const password = checkNewPassword(body.newPassword, body.newPasswordConfirmation, errors);

  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const userId = consumeResetToken(body.token);
  if (!userId) {
    return Response.json(
      { errors: ["Este link é inválido ou já expirou. Peça um novo."] },
      { status: 400 },
    );
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    hashPassword(password),
    userId,
  );

  return new Response(null, { status: 204 });
}
