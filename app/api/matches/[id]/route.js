import { readMatchInput } from "../../../../lib/matchInput.js";
import { checkReferences, deleteMatch, getMatch, updateMatch } from "../../../../lib/matches.js";
import { getCurrentUser } from "../../../../lib/session.js";

function unauthorized() {
  return Response.json({ errors: ["Faça login para continuar."] }, { status: 401 });
}

function notFound() {
  return Response.json({ error: "Jogo não encontrado." }, { status: 404 });
}

async function readId(context) {
  const { id } = await context.params;
  return Number(id);
}

export async function GET(request, context) {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }
  const match = getMatch(user.id, await readId(context));
  return match ? Response.json(match) : notFound();
}

export async function PUT(request, context) {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const id = await readId(context);
  const existing = getMatch(user.id, id);
  if (!existing) {
    return notFound();
  }

  const body = await request.json();
  const { data, errors } = readMatchInput(body, existing.supportedTeamId);
  const problems = errors.length > 0 ? errors : checkReferences(data);

  if (problems.length > 0) {
    return Response.json({ errors: problems }, { status: 400 });
  }

  const match = updateMatch(user.id, id, data);
  return match ? Response.json({ id: match.id }) : notFound();
}

export async function DELETE(request, context) {
  const user = await getCurrentUser();
  if (!user) {
    return unauthorized();
  }
  const removed = deleteMatch(user.id, await readId(context));
  return removed ? new Response(null, { status: 204 }) : notFound();
}
