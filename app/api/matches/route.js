import { readMatchInput } from "../../../lib/matchInput.js";
import { checkReferences, createMatch, listMatches } from "../../../lib/matches.js";
import { getCurrentUser } from "../../../lib/session.js";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
  }
  return Response.json(listMatches(user.id));
}

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
  }

  const body = await request.json();
  const { data, errors } = readMatchInput(body, user.teamId);
  const problems = errors.length > 0 ? errors : checkReferences(data);

  if (problems.length > 0) {
    return Response.json({ errors: problems }, { status: 400 });
  }

  const match = createMatch(user.id, data);
  return Response.json({ id: match.id }, { status: 201 });
}
