import { listMatches } from "../../../lib/matches.js";
import { getCurrentUser } from "../../../lib/session.js";
import { summarize } from "../../../lib/stats.js";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
  }
  return Response.json(summarize(listMatches(user.id)));
}
