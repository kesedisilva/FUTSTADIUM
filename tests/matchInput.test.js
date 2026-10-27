import { test } from "node:test";
import assert from "node:assert/strict";
import { readMatchInput } from "../lib/matchInput.js";

const SUPPORTED = 7;

function validBody(overrides = {}) {
  return {
    matchDate: "2026-09-14",
    competitionId: "1",
    opponentId: "9",
    isHome: "true",
    homeScore: "2",
    awayScore: "1",
    stadiumId: "3",
    ticketPrice: "90,00",
    ...overrides,
  };
}

test("coloca o time do usuário como mandante quando é em casa", () => {
  const { data, errors } = readMatchInput(validBody(), SUPPORTED);
  assert.deepEqual(errors, []);
  assert.equal(data.homeTeamId, 7);
  assert.equal(data.awayTeamId, 9);
  assert.equal(data.supportedTeamId, 7);
  assert.equal(data.homeScore, 2);
  assert.equal(data.awayScore, 1);
  assert.equal(data.ticketPrice, 90);
});

test("inverte os lados quando é fora de casa", () => {
  const { data, errors } = readMatchInput(validBody({ isHome: "false" }), SUPPORTED);
  assert.deepEqual(errors, []);
  assert.equal(data.homeTeamId, 9);
  assert.equal(data.awayTeamId, 7);
  assert.equal(data.supportedTeamId, 7);
});

test("aceita isHome como booleano além de texto", () => {
  const { data } = readMatchInput(validBody({ isHome: false }), SUPPORTED);
  assert.equal(data.homeTeamId, 9);
});

test("recusa adversário igual ao time do usuário", () => {
  const { errors } = readMatchInput(validBody({ opponentId: "7" }), SUPPORTED);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /advers/i);
});

test("recusa data no futuro", () => {
  const { errors } = readMatchInput(validBody({ matchDate: "2099-05-01" }), SUPPORTED);
  assert.equal(errors.length, 1);
});

test("exige todos os campos quando o corpo vem vazio", () => {
  const { errors } = readMatchInput({}, SUPPORTED);
  assert.ok(errors.length >= 6, `esperava 6 ou mais erros, veio ${errors.length}`);
});

test("recusa preço negativo", () => {
  const { errors } = readMatchInput(validBody({ ticketPrice: "-10" }), SUPPORTED);
  assert.equal(errors.length, 1);
});
