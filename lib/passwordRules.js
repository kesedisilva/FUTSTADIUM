import { verifyPassword } from "./password.js";

export const MIN_LENGTH = 6;

export function checkNewPassword(password, confirmation, errors) {
  const value = String(password ?? "");

  if (value.length < MIN_LENGTH) {
    errors.push(`A senha precisa ter ao menos ${MIN_LENGTH} caracteres.`);
  }
  if (value !== String(confirmation ?? "")) {
    errors.push("As senhas não são iguais.");
  }

  return value;
}

export function checkCurrentPassword(password, storedHash, errors) {
  if (!verifyPassword(String(password ?? ""), storedHash)) {
    errors.push("A senha atual está incorreta.");
  }
}
