import db from "./db.js";
import { resultOf } from "./matchResult.js";

const SELECT_MATCH = `
  SELECT
    m.id,
    m.user_id AS userId,
    m.supported_team_id AS supportedTeamId,
    m.match_date AS matchDate,
    m.home_team_id AS homeTeamId,
    m.away_team_id AS awayTeamId,
    m.home_score AS homeScore,
    m.away_score AS awayScore,
    m.ticket_price AS ticketPrice,
    home.name AS homeTeamName,
    away.name AS awayTeamName,
    c.id AS competitionId,
    c.name AS competitionName,
    s.id AS stadiumId,
    s.name AS stadiumName,
    s.city AS stadiumCity
  FROM matches m
  JOIN teams home ON home.id = m.home_team_id
  JOIN teams away ON away.id = m.away_team_id
  JOIN competitions c ON c.id = m.competition_id
  JOIN stadiums s ON s.id = m.stadium_id
`;

function shape(row) {
  return {
    ...row,
    stadium: { id: row.stadiumId, name: row.stadiumName, city: row.stadiumCity },
    competition: { id: row.competitionId, name: row.competitionName },
    isHome: row.supportedTeamId === row.homeTeamId,
    opponentId: row.supportedTeamId === row.homeTeamId ? row.awayTeamId : row.homeTeamId,
    opponentName: row.supportedTeamId === row.homeTeamId ? row.awayTeamName : row.homeTeamName,
    result: resultOf(row),
  };
}

export function listMatches(userId) {
  return db
    .prepare(`${SELECT_MATCH} WHERE m.user_id = ? ORDER BY m.match_date DESC, m.id DESC`)
    .all(userId)
    .map(shape);
}

export function getMatch(userId, id) {
  const row = db
    .prepare(`${SELECT_MATCH} WHERE m.id = ? AND m.user_id = ?`)
    .get(id, userId);
  return row ? shape(row) : null;
}

export function createMatch(userId, data) {
  const result = db
    .prepare(`
      INSERT INTO matches
        (user_id, supported_team_id, match_date, competition_id,
         home_team_id, away_team_id, home_score, away_score, stadium_id, ticket_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      userId,
      data.supportedTeamId,
      data.matchDate,
      data.competitionId,
      data.homeTeamId,
      data.awayTeamId,
      data.homeScore,
      data.awayScore,
      data.stadiumId,
      data.ticketPrice,
    );
  return getMatch(userId, Number(result.lastInsertRowid));
}

export function updateMatch(userId, id, data) {
  const result = db
    .prepare(`
      UPDATE matches SET
        match_date = ?, competition_id = ?,
        home_team_id = ?, away_team_id = ?,
        home_score = ?, away_score = ?,
        stadium_id = ?, ticket_price = ?
      WHERE id = ? AND user_id = ?
    `)
    .run(
      data.matchDate,
      data.competitionId,
      data.homeTeamId,
      data.awayTeamId,
      data.homeScore,
      data.awayScore,
      data.stadiumId,
      data.ticketPrice,
      id,
      userId,
    );
  return result.changes === 0 ? null : getMatch(userId, id);
}

export function deleteMatch(userId, id) {
  const result = db
    .prepare("DELETE FROM matches WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return result.changes > 0;
}

function plain(rows) {
  return rows.map((row) => ({ ...row }));
}

export function getCatalog() {
  return {
    teams: plain(
      db
        .prepare("SELECT id, name, stadium_id AS stadiumId FROM teams ORDER BY name")
        .all(),
    ),
    stadiums: plain(
      db.prepare("SELECT id, name, city FROM stadiums ORDER BY name").all(),
    ),
    competitions: plain(
      db.prepare("SELECT id, name FROM competitions ORDER BY id").all(),
    ),
  };
}

export function checkReferences(data) {
  const errors = [];

  if (!db.prepare("SELECT 1 FROM competitions WHERE id = ?").get(data.competitionId)) {
    errors.push("Campeonato inválido.");
  }
  if (!db.prepare("SELECT 1 FROM stadiums WHERE id = ?").get(data.stadiumId)) {
    errors.push("Estádio inválido.");
  }

  const team = db.prepare("SELECT 1 FROM teams WHERE id = ?");
  for (const id of [data.homeTeamId, data.awayTeamId]) {
    if (!team.get(id)) {
      errors.push("Time inválido.");
    }
  }

  return errors;
}

export function teamExists(id) {
  return Boolean(db.prepare("SELECT 1 FROM teams WHERE id = ?").get(id));
}
