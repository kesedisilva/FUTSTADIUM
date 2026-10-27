import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "../lib/session";
import { formatMoney } from "../lib/format";
import { listMatches } from "../lib/matches";
import { summarize } from "../lib/stats";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const matches = user ? listMatches(user.id) : [];
  const stats = summarize(matches);

  if (stats.games === 0) {
    return (
      <main className="page">
        <div className="page__head">
          <div>
            <h1>Painel</h1>
            <p>Resumo dos jogos que você foi ao estádio</p>
          </div>
        </div>

        <div className="card empty">
          <div className="empty__mark">⚽</div>
          <h3>Sem jogos por enquanto</h3>
          <p>Cadastre o primeiro jogo para o painel começar a contar.</p>
          <Link className="btn btn--primary" href="/jogos/novo">
            Registrar jogo
          </Link>
        </div>
      </main>
    );
  }

  const total = stats.wins + stats.draws + stats.losses;

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Painel</h1>
          <p>Resumo dos jogos que você foi ao estádio</p>
        </div>
        <div className="page__actions">
          <Link className="btn btn--primary" href="/jogos/novo">
            Novo jogo
          </Link>
        </div>
      </div>

      <div className="stats">
        <div className="tile">
          <div className="tile__label">Jogos</div>
          <div className="tile__value">{stats.games}</div>
          <div className="tile__hint">Idas ao estádio registradas</div>
        </div>

        <div className="tile">
          <div className="tile__label">Aproveitamento</div>
          <div className="tile__value tile__value--accent">{stats.winRate}%</div>
          <div className="tile__hint">Dos pontos possíveis nos jogos que você viu</div>
        </div>

        <div className="tile">
          <div className="tile__label">Estádios</div>
          <div className="tile__value">{stats.stadiumVisits.length}</div>
          <div className="tile__hint">Praças diferentes visitadas</div>
        </div>

        <div className="tile">
          <div className="tile__label">Gasto</div>
          <div className="tile__value">{formatMoney(stats.totalSpent)}</div>
          <div className="tile__hint">
            {formatMoney(stats.averagePerMatch)} em média por jogo
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="card card--pad">
          <h2>Retrospecto</h2>
          <div className="record" style={{ marginTop: 18 }}>
            <div style={{ color: "var(--win)" }}>
              {stats.wins}
              <small>Vitórias</small>
            </div>
            <div style={{ color: "var(--draw)" }}>
              {stats.draws}
              <small>Empates</small>
            </div>
            <div style={{ color: "var(--loss)" }}>
              {stats.losses}
              <small>Derrotas</small>
            </div>
          </div>
          <div className="bar">
            <i className="w" style={{ flex: stats.wins }} />
            <i className="d" style={{ flex: stats.draws }} />
            <i className="l" style={{ flex: stats.losses }} />
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            {stats.wins} de {total} jogos terminaram em vitória.
          </p>
        </div>

        <div className="card">
          <div className="card__head">
            <h2>Estádios visitados</h2>
            <span className="muted">{stats.stadiumVisits.length}</span>
          </div>
          <div className="rows">
            {stats.stadiumVisits.map((stadium) => (
              <div className="row" key={stadium.stadiumId}>
                <span className="strong">{stadium.name}</span>
                <span className="muted">
                  {stadium.visits} {stadium.visits === 1 ? "ida" : "idas"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
