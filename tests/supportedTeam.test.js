import { test } from "node:test";
import assert from "node:assert/strict";
import { readMatchInput } from "../lib/matchInput.js";

const PALMEIRAS = 2;
const CORINTHIANS = 1;
const SANTOS = 4;

function body(overrides = {}) {
  return {
    matchDate: "2026-09-14",
    competitionId: "1",
    opponentId: String(SANTOS),
    isHome: "true",
    homeScore: "3",
    awayScore: "0",
    stadiumId: "3",
    ticketPrice: "90,00",
    ...overrides,
  };
}

test("editar usa o time apoiado na época, não o time atual do usuário", () => {
  const { data, errors } = readMatchInput(body(), PALMEIRAS);
  assert.deepEqual(errors, []);
  assert.equal(data.supportedTeamId, PALMEIRAS);
  assert.equal(data.homeTeamId, PALMEIRAS);
  assert.equal(data.awayTeamId, SANTOS);
});

test("o time apoiado é sempre um dos dois lados do jogo", () => {
  for (const isHome of ["true", "false"]) {
    const { data } = readMatchInput(body({ isHome }), CORINTHIANS);
    assert.ok(
      data.supportedTeamId === data.homeTeamId ||
        data.supportedTeamId === data.awayTeamId,
      "o time apoiado ficou fora da partida",
    );
  }
});

test("recusa adversário igual ao time apoiado, não ao time atual", () => {
  const { errors } = readMatchInput(body({ opponentId: String(PALMEIRAS) }), PALMEIRAS);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /advers/i);

  const outro = readMatchInput(body({ opponentId: String(CORINTHIANS) }), PALMEIRAS);
  assert.deepEqual(outro.errors, []);
});
