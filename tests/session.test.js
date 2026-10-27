import { test } from "node:test";
import assert from "node:assert/strict";
import { parseSession, serializeSession } from "../lib/sessionToken.js";

test("parseSession devolve o id que foi assinado", () => {
  assert.equal(parseSession(serializeSession(7)), 7);
});

test("parseSession recusa cookie adulterado", () => {
  const valid = serializeSession(7);
  const tampered = valid.replace(/^7\./, "8.");
  assert.equal(parseSession(tampered), null);
});

test("parseSession recusa assinatura multibyte sem explodir", () => {
  const multibyte = "ç".repeat(64);
  assert.equal(parseSession(`7.${multibyte}`), null);
});

test("parseSession recusa assinatura que não é hexadecimal", () => {
  assert.equal(parseSession(`7.${"z".repeat(64)}`), null);
});

test("parseSession recusa assinatura inventada", () => {
  assert.equal(parseSession("7.assinaturafalsa"), null);
  assert.equal(parseSession("7"), null);
  assert.equal(parseSession(""), null);
  assert.equal(parseSession(undefined), null);
});
