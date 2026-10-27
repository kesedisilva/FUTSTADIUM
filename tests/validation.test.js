import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseMoney,
  parseScore,
  parsePastDate,
  requiredId,
} from "../lib/validation.js";

test("parseMoney aceita máscara brasileira", () => {
  const errors = [];
  assert.equal(parseMoney("1.250,50", "O preço", errors), 1250.5);
  assert.equal(parseMoney("60,50", "O preço", errors), 60.5);
  assert.equal(parseMoney("60.50", "O preço", errors), 60.5);
  assert.equal(parseMoney("R$ 89,90", "O preço", errors), 89.9);
  assert.equal(parseMoney("0", "O preço", errors), 0);
  assert.deepEqual(errors, []);
});

test("parseMoney rejeita texto, negativo e vazio", () => {
  const errors = [];
  parseMoney("abc", "O preço", errors);
  parseMoney("-5", "O preço", errors);
  parseMoney("", "O preço", errors);
  assert.equal(errors.length, 3);
});

test("parseScore aceita zero e rejeita fora da faixa", () => {
  const errors = [];
  assert.equal(parseScore("0", "O placar", errors), 0);
  assert.equal(parseScore("7", "O placar", errors), 7);
  assert.deepEqual(errors, []);

  parseScore("-1", "O placar", errors);
  parseScore("100", "O placar", errors);
  parseScore("x", "O placar", errors);
  parseScore("", "O placar", errors);
  assert.equal(errors.length, 4);
});

test("parsePastDate recusa data futura", () => {
  const errors = [];
  parsePastDate("2099-01-01", "A data", errors);
  assert.equal(errors.length, 1);
});

test("parsePastDate aceita data passada e devolve o texto", () => {
  const errors = [];
  assert.equal(parsePastDate("2026-09-14", "A data", errors), "2026-09-14");
  assert.deepEqual(errors, []);
});

test("parsePastDate recusa formato inválido e vazio", () => {
  const errors = [];
  parsePastDate("14/09/2026", "A data", errors);
  parsePastDate("", "A data", errors);
  assert.equal(errors.length, 2);
});

test("requiredId aceita número e recusa o resto", () => {
  const errors = [];
  assert.equal(requiredId("7", "O time", errors), 7);
  assert.deepEqual(errors, []);

  requiredId("", "O time", errors);
  requiredId("abc", "O time", errors);
  requiredId("0", "O time", errors);
  assert.equal(errors.length, 3);
});
