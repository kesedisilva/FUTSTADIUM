import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword } from "../lib/password.js";
import { checkCurrentPassword, checkNewPassword } from "../lib/passwordRules.js";

test("checkNewPassword aceita senha válida e confirmada", () => {
  const errors = [];
  assert.equal(checkNewPassword("segredo123", "segredo123", errors), "segredo123");
  assert.deepEqual(errors, []);
});

test("checkNewPassword recusa senha curta", () => {
  const errors = [];
  checkNewPassword("abc", "abc", errors);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /6 caracteres/);
});

test("checkNewPassword recusa confirmação diferente", () => {
  const errors = [];
  checkNewPassword("segredo123", "segredo124", errors);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /não são iguais/);
});

test("checkNewPassword acumula os dois erros", () => {
  const errors = [];
  checkNewPassword("abc", "xyz", errors);
  assert.equal(errors.length, 2);
});

test("checkNewPassword trata ausência de valor", () => {
  const errors = [];
  checkNewPassword(undefined, undefined, errors);
  assert.equal(errors.length, 1);
});

test("checkCurrentPassword aceita a senha atual correta", () => {
  const errors = [];
  checkCurrentPassword("segredo123", hashPassword("segredo123"), errors);
  assert.deepEqual(errors, []);
});

test("checkCurrentPassword recusa a senha atual errada", () => {
  const errors = [];
  checkCurrentPassword("outra", hashPassword("segredo123"), errors);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /senha atual/i);
});
