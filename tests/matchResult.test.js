import { test } from "node:test";
import assert from "node:assert/strict";
import { resultOf, RESULT_LABELS } from "../lib/matchResult.js";

const base = { homeTeamId: 1, awayTeamId: 2, homeScore: 2, awayScore: 1 };

test("resultOf enxerga pelos olhos do time apoiado", () => {
  assert.equal(resultOf({ ...base, supportedTeamId: 1 }), "win");
  assert.equal(resultOf({ ...base, supportedTeamId: 2 }), "loss");
});

test("resultOf reconhece empate dos dois lados", () => {
  const drawn = { ...base, awayScore: 2 };
  assert.equal(resultOf({ ...drawn, supportedTeamId: 1 }), "draw");
  assert.equal(resultOf({ ...drawn, supportedTeamId: 2 }), "draw");
});

test("resultOf trata vitória fora de casa", () => {
  const away = { homeTeamId: 1, awayTeamId: 2, homeScore: 0, awayScore: 3 };
  assert.equal(resultOf({ ...away, supportedTeamId: 2 }), "win");
  assert.equal(resultOf({ ...away, supportedTeamId: 1 }), "loss");
});

test("RESULT_LABELS traduz os três resultados", () => {
  assert.equal(RESULT_LABELS.win, "Vitória");
  assert.equal(RESULT_LABELS.draw, "Empate");
  assert.equal(RESULT_LABELS.loss, "Derrota");
});
