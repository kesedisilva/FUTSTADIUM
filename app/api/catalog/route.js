import { getCatalog } from "../../../lib/matches.js";

export async function GET() {
  return Response.json(getCatalog());
}
