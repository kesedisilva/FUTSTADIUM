import { endSession } from "../../../../lib/session.js";

export async function POST() {
  await endSession();
  return new Response(null, { status: 204 });
}
