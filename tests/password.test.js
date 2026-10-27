import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/password.js";

test("verifyPassword aceita a senha correta e recusa a errada", () => {
  const stored = hashPassword("segredo123");
  assert.equal(verifyPassword("segredo123", stored), true);
  assert.equal(verifyPassword("outra", stored), false);
});

test("hashPassword nunca guarda a senha em claro", () => {
  const stored = hashPassword("segredo123");
  assert.ok(!stored.includes("segredo123"));
});

test("hashPassword usa sal diferente a cada chamada", () => {
  assert.notEqual(hashPassword("segredo123"), hashPassword("segredo123"));
});

test("verifyPassword não quebra com hash inválido", () => {
  assert.equal(verifyPassword("segredo123", "lixo"), false);
  assert.equal(verifyPassword("segredo123", ""), false);
});
