import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

let workdir;
let original;
let matches;
let db;

before(async () => {
  original = process.cwd();
  workdir = mkdtempSync(path.join(tmpdir(), "caderno-"));
  process.chdir(workdir);

  db = (await import("../lib/db.js")).default;
  matches = await import("../lib/matches.js");

  db.exec("INSERT INTO stadiums (name, city) VALUES ('Arena', 'Cidade')");
  db.exec("INSERT INTO teams (name, stadium_id) VALUES ('Time A', 1), ('Time B', 1)");
  db.exec("INSERT INTO competitions (name) VALUES ('Campeonato')");
  db.exec(`
    INSERT INTO users (name, email, password_hash, team_id)
    VALUES ('Dono', 'dono@exemplo.com', 'x', 1), ('Outro', 'outro@exemplo.com', 'x', 2)
  `);
});

after(() => {
  process.chdir(original);
  try {
    db.close();
    rmSync(workdir, { recursive: true, force: true });
  } catch {
    process.exitCode = process.exitCode ?? 0;
  }
});

function createSample(userId, supportedTeamId) {
  return matches.createMatch(userId, {
    supportedTeamId,
    matchDate: "2026-05-10",
    competitionId: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    homeScore: 2,
    awayScore: 0,
    stadiumId: 1,
    ticketPrice: 50,
  });
}

test("getMatch não devolve jogo de outro usuário", () => {
  const match = createSample(1, 1);
  assert.ok(matches.getMatch(1, match.id));
  assert.equal(matches.getMatch(2, match.id), null);
});

test("deleteMatch não apaga jogo de outro usuário", () => {
  const match = createSample(1, 1);
  assert.equal(matches.deleteMatch(2, match.id), false);
  assert.ok(matches.getMatch(1, match.id));
  assert.equal(matches.deleteMatch(1, match.id), true);
  assert.equal(matches.getMatch(1, match.id), null);
});

test("updateMatch não altera jogo de outro usuário", () => {
  const match = createSample(1, 1);
  const changed = matches.updateMatch(2, match.id, {
    matchDate: "2026-06-01",
    competitionId: 1,
    homeTeamId: 1,
    awayTeamId: 2,
    homeScore: 9,
    awayScore: 9,
    stadiumId: 1,
    ticketPrice: 10,
  });
  assert.equal(changed, null);
  assert.equal(matches.getMatch(1, match.id).homeScore, 2);
});

test("updateMatch altera o jogo do próprio dono", () => {
  const match = createSample(1, 1);
  const changed = matches.updateMatch(1, match.id, {
    matchDate: "2026-06-01",
    competitionId: 1,
    homeTeamId: 2,
    awayTeamId: 1,
    homeScore: 0,
    awayScore: 3,
    stadiumId: 1,
    ticketPrice: 75,
  });
  assert.equal(changed.homeScore, 0);
  assert.equal(changed.awayScore, 3);
  assert.equal(changed.result, "win");
  assert.equal(changed.ticketPrice, 75);
});

test("checkReferences recusa ids que não existem no catálogo", () => {
  const errors = matches.checkReferences({
    competitionId: 999,
    stadiumId: 999,
    supportedTeamId: 1,
    homeTeamId: 1,
    awayTeamId: 999,
  });
  assert.equal(errors.length, 3);
});

test("checkReferences aceita ids válidos", () => {
  const errors = matches.checkReferences({
    competitionId: 1,
    stadiumId: 1,
    supportedTeamId: 1,
    homeTeamId: 1,
    awayTeamId: 2,
  });
  assert.deepEqual(errors, []);
});

test("listMatches só enxerga os jogos do próprio usuário", () => {
  const before = matches.listMatches(2).length;
  createSample(1, 1);
  assert.equal(matches.listMatches(2).length, before);
});
