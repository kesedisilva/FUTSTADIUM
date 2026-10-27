import db from "../../../lib/db.js";
import { getCurrentUser } from "../../../lib/session.js";
import { requiredId } from "../../../lib/validation.js";

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
  }

  const body = await request.json();
  const errors = [];
  const teamId = requiredId(body.teamId, "O time do coração", errors);

  if (errors.length === 0 && !db.prepare("SELECT id FROM teams WHERE id = ?").get(teamId)) {
    errors.push("Time inválido.");
  }
  if (errors.length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  db.prepare("UPDATE users SET team_id = ? WHERE id = ?").run(teamId, user.id);
  return Response.json({ teamId });
}
