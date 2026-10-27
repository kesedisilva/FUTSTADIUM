import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

let workdir;
let original;
let db;
let reset;

before(async () => {
  original = process.cwd();
  workdir = mkdtempSync(path.join(tmpdir(), "caderno-reset-"));
  process.chdir(workdir);

  db = (await import("../lib/db.js")).default;
  reset = await import("../lib/passwordReset.js");

  db.exec("INSERT INTO stadiums (name, city) VALUES ('Arena', 'Cidade')");
  db.exec("INSERT INTO teams (name, stadium_id) VALUES ('Time', 1)");
  db.exec(`
    INSERT INTO users (name, email, password_hash, team_id)
    VALUES ('Dono', 'dono@exemplo.com', 'x', 1), ('Outro', 'outro@exemplo.com', 'x', 1)
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

test("um token recém-criado identifica o usuário", () => {
  const token = reset.createResetToken(1);
  assert.equal(reset.consumeResetToken(token), 1);
});

test("o token em claro nunca fica guardado no banco", () => {
  const token = reset.createResetToken(1);
  const linhas = db.prepare("SELECT token_hash FROM password_resets").all();
  assert.ok(linhas.every((linha) => linha.token_hash !== token));
});

test("o mesmo token não serve duas vezes", () => {
  const token = reset.createResetToken(2);
  assert.equal(reset.consumeResetToken(token), 2);
  assert.equal(reset.consumeResetToken(token), null);
});

test("token expirado é recusado", () => {
  const token = reset.createResetToken(1, -1000);
  assert.equal(reset.consumeResetToken(token), null);
});

test("token inventado é recusado", () => {
  assert.equal(reset.consumeResetToken("token-que-nunca-existiu"), null);
  assert.equal(reset.consumeResetToken(""), null);
  assert.equal(reset.consumeResetToken(undefined), null);
});

test("criar um token novo invalida os anteriores do mesmo usuário", () => {
  const antigo = reset.createResetToken(1);
  reset.createResetToken(1);
  assert.equal(reset.consumeResetToken(antigo), null);
});

test("recordEmail guarda a mensagem para a caixa de entrada", () => {
  reset.recordEmail("dono@exemplo.com", "Redefinir senha", "corpo", "/redefinir?token=x");
  const ultimo = db.prepare("SELECT * FROM emails ORDER BY id DESC LIMIT 1").get();
  assert.equal(ultimo.recipient, "dono@exemplo.com");
  assert.equal(ultimo.link, "/redefinir?token=x");
});
