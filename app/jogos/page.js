import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteMatch from "../../components/DeleteMatch";
import { formatDate, formatMoney } from "../../lib/format";
import { RESULT_LABELS } from "../../lib/matchResult";
import { listMatches } from "../../lib/matches";
import { getCurrentUser } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function MatchList() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const matches = user ? listMatches(user.id) : [];

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Jogos</h1>
          <p>{matches.length} jogo(s) registrados no estádio</p>
        </div>
        <div className="page__actions">
          <Link className="btn btn--primary" href="/jogos/novo">
            Novo jogo
          </Link>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Partida</th>
                  <th>Resultado</th>
                  <th>Estádio</th>
                  <th>Campeonato</th>
                  <th className="right">Ingresso</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td className="strong" data-label="Data">
                      {formatDate(match.matchDate)}
                    </td>
                    <td data-label="Partida">
                      <span className="scoreline">
                        {match.homeTeamName}
                        <b>
                          {match.homeScore} × {match.awayScore}
                        </b>
                        {match.awayTeamName}
                      </span>
                    </td>
                    <td data-label="Resultado">
                      <span className={`badge badge--${match.result}`}>
                        {RESULT_LABELS[match.result]}
                      </span>
                    </td>
                    <td data-label="Estádio">
                      {match.stadium.name}
                      <div className="muted">{match.stadium.city}</div>
                    </td>
                    <td className="muted" data-label="Campeonato">
                      {match.competition.name}
                    </td>
                    <td className="right money" data-label="Ingresso">
                      {formatMoney(match.ticketPrice)}
                    </td>
                    <td className="cell-actions">
                      <div className="actions">
                        <Link
                          className="btn btn--ghost btn--small"
                          href={`/jogos/${match.id}/editar`}
                        >
                          Editar
                        </Link>
                        <DeleteMatch match={match} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card empty">
          <div className="empty__mark">🎟️</div>
          <h3>Nenhum jogo registrado</h3>
          <p>Comece pelo último jogo que você foi assistir no estádio.</p>
          <Link className="btn btn--primary" href="/jogos/novo">
            Registrar jogo
          </Link>
        </div>
      )}
    </main>
  );
}
