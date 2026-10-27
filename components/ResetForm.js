"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordField from "./PasswordField";

export default function ResetForm({ token }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);

    const response = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, newPasswordConfirmation }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível redefinir a senha."]);
      setBusy(false);
      return;
    }

    setDone(true);
    setBusy(false);
  }

  if (done) {
    return (
      <div className="card empty">
        <div className="empty__mark">🔐</div>
        <h3>Senha redefinida</h3>
        <p>Agora é só entrar com a senha nova.</p>
        <Link className="btn btn--primary" href="/login">
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form className="form card card--pad" onSubmit={submit}>
      {errors.length > 0 && (
        <div className="flashes">
          {errors.map((text) => (
            <p className="flash flash--error" key={text}>{text}</p>
          ))}
        </div>
      )}

      <div className="field--inline">
        <PasswordField
          label="Nova senha"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
          minLength={6}
        />
        <PasswordField
          label="Confirmar nova senha"
          value={newPasswordConfirmation}
          onChange={setNewPasswordConfirmation}
          autoComplete="new-password"
          minLength={6}
        />
      </div>

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={busy || !token}>
          {busy ? "Salvando..." : "Redefinir senha"}
        </button>
        <Link className="btn btn--ghost" href="/login">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
