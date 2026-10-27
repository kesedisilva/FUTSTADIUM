import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "../../../../lib/session";
import MatchForm from "../../../../components/MatchForm";
import { getCatalog, getMatch } from "../../../../lib/matches";

export const dynamic = "force-dynamic";

export default async function EditMatch({ params }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const match = getMatch(user.id, Number(id));

  if (!match) {
    notFound();
  }

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Editar jogo</h1>
          <p>
            {match.homeTeamName} {match.homeScore} × {match.awayScore} {match.awayTeamName}
          </p>
        </div>
      </div>

      <MatchForm catalog={getCatalog()} user={user} match={match} />
    </main>
  );
}
