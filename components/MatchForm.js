"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { maskMoney } from "../lib/format";

export default function MatchForm({ catalog, user, match }) {
  const router = useRouter();
  const editing = Boolean(match);

  const supportedTeamId = match ? match.supportedTeamId : user.teamId;
  const userTeam = catalog.teams.find((team) => team.id === supportedTeamId);
  const opponents = catalog.teams.filter((team) => team.id !== supportedTeamId);

  const [isHome, setIsHome] = useState(match ? match.isHome : true);
  const [opponentId, setOpponentId] = useState(match ? String(match.opponentId) : "");
  const [stadiumId, setStadiumId] = useState(
    match ? String(match.stadiumId) : String(userTeam.stadiumId),
  );
  const [matchDate, setMatchDate] = useState(match ? match.matchDate : "");
  const [competitionId, setCompetitionId] = useState(
    match ? String(match.competitionId) : String(catalog.competitions[0].id),
  );
  const [homeScore, setHomeScore] = useState(match ? String(match.homeScore) : "");
  const [awayScore, setAwayScore] = useState(match ? String(match.awayScore) : "");
  const [ticketPrice, setTicketPrice] = useState(
    match ? maskMoney(String(Math.round(match.ticketPrice * 100))) : "",
  );
  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  function suggestStadium(nextIsHome, nextOpponentId) {
    if (nextIsHome) {
      setStadiumId(String(userTeam.stadiumId));
      return;
    }
    const opponent = catalog.teams.find((team) => String(team.id) === String(nextOpponentId));
    if (opponent) {
      setStadiumId(String(opponent.stadiumId));
    }
  }

  function changeSide(nextIsHome) {
    setIsHome(nextIsHome);
    const left = homeScore;
    setHomeScore(awayScore);
    setAwayScore(left);
    suggestStadium(nextIsHome, opponentId);
  }

  function changeOpponent(value) {
    setOpponentId(value);
    suggestStadium(isHome, value);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setErrors([]);

    const payload = {
      matchDate,
      competitionId,
      opponentId,
      isHome,
      homeScore,
      awayScore,
      stadiumId,
      ticketPrice,
    };

    const response = await fetch(
      editing ? `/api/matches/${match.id}` : "/api/matches",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível salvar o jogo."]);
      setSaving(false);
      return;
    }

    router.push("/jogos");
    router.refresh();
  }

  const opponentName =
    opponents.find((team) => String(team.id) === String(opponentId))?.name ?? "Adversário";
  const leftName = isHome ? userTeam.name : opponentName;
  const rightName = isHome ? opponentName : userTeam.name;

  return (
    <form className="form card card--pad" onSubmit={submit}>
      {errors.length > 0 && (
        <div className="flashes">
          {errors.map((message) => (
            <p className="flash flash--error" key={message}>
              {message}
            </p>
          ))}
        </div>
      )}

      <div className="field--inline">
        <label className="field">
          <span>Data do jogo</span>
          <input
            type="date"
            max={new Date().toLocaleDateString("sv-SE")}
            value={matchDate}
            onChange={(event) => setMatchDate(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Campeonato</span>
          <select
            value={competitionId}
            onChange={(event) => setCompetitionId(event.target.value)}
            required
          >
            {catalog.competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field--inline">
        <label className="field">
          <span>Adversário</span>
          <select
            value={opponentId}
            onChange={(event) => changeOpponent(event.target.value)}
            required
          >
            <option value="">Selecione o adversário</option>
            {opponents.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <div className="field">
          <span>Mando de campo</span>
          <div className="toggle">
            <button
              type="button"
              className={isHome ? "is-active" : ""}
              onClick={() => changeSide(true)}
            >
              Em casa
            </button>
            <button
              type="button"
              className={isHome ? "" : "is-active"}
              onClick={() => changeSide(false)}
            >
              Fora
            </button>
          </div>
        </div>
      </div>

      <div className="field">
        <span>Placar</span>
        <div className="scoreboard">
          <div className="scoreboard__team">{leftName}</div>
          <input
            type="text"
            inputMode="numeric"
            value={homeScore}
            onChange={(event) => setHomeScore(event.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="0"
            required
          />
          <div className="scoreboard__x">×</div>
          <input
            type="text"
            inputMode="numeric"
            value={awayScore}
            onChange={(event) => setAwayScore(event.target.value.replace(/\D/g, "").slice(0, 2))}
            placeholder="0"
            required
          />
          <div className="scoreboard__team scoreboard__team--away">{rightName}</div>
        </div>
      </div>

      <div className="field--inline">
        <label className="field">
          <span>Estádio</span>
          <select
            value={stadiumId}
            onChange={(event) => setStadiumId(event.target.value)}
            required
          >
            {catalog.stadiums.map((stadium) => (
              <option key={stadium.id} value={stadium.id}>
                {stadium.name} — {stadium.city}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Preço do ingresso</span>
          <input
            type="text"
            inputMode="numeric"
            value={ticketPrice}
            onChange={(event) => setTicketPrice(maskMoney(event.target.value))}
            placeholder="R$ 0,00"
            required
          />
        </label>
      </div>

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar jogo"}
        </button>
        <a className="btn btn--ghost" href="/jogos">
          Cancelar
        </a>
      </div>
    </form>
  );
}
