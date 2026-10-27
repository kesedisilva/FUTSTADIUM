import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize } from "../lib/stats.js";

function match(result, ticketPrice, stadium = { id: 1, name: "Neo Química Arena" }) {
  return { result, ticketPrice, stadium };
}

const win = (price, stadium) => match("win", price, stadium);
const draw = (price, stadium) => match("draw", price, stadium);
const loss = (price, stadium) => match("loss", price, stadium);

test("summarize sem jogos não divide por zero", () => {
  const s = summarize([]);
  assert.equal(s.games, 0);
  assert.equal(s.wins, 0);
  assert.equal(s.winRate, 0);
  assert.equal(s.totalSpent, 0);
  assert.equal(s.averagePerMatch, 0);
  assert.deepEqual(s.stadiumVisits, []);
});

test("summarize sem vitórias ainda calcula a média por jogo", () => {
  const s = summarize([draw(10), loss(20)]);
  assert.equal(s.games, 2);
  assert.equal(s.winRate, 16.7);
  assert.equal(s.totalSpent, 30);
  assert.equal(s.averagePerMatch, 15);
});

test("summarize calcula aproveitamento por pontos, não taxa de vitória", () => {
  const s = summarize([win(50), win(50), draw(50), loss(50)]);
  assert.equal(s.games, 4);
  assert.equal(s.wins, 2);
  assert.equal(s.draws, 1);
  assert.equal(s.losses, 1);
  assert.equal(s.winRate, 58.3);
});

test("summarize soma gasto e divide pelo número de jogos", () => {
  const s = summarize([win(100), win(140), loss(60)]);
  assert.equal(s.totalSpent, 300);
  assert.equal(s.averagePerMatch, 100);
});

test("summarize agrupa estádios e ordena por visitas", () => {
  const arena = { id: 1, name: "Neo Química Arena" };
  const morumbi = { id: 2, name: "MorumBIS" };
  const s = summarize([win(50, arena), loss(50, morumbi), draw(50, arena)]);
  assert.deepEqual(s.stadiumVisits, [
    { stadiumId: 1, name: "Neo Química Arena", visits: 2 },
    { stadiumId: 2, name: "MorumBIS", visits: 1 },
  ]);
});

test("summarize com aproveitamento máximo e mínimo", () => {
  assert.equal(summarize([win(10), win(10)]).winRate, 100);
  assert.equal(summarize([loss(10), loss(10)]).winRate, 0);
});
