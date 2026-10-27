"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);

    const response = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const body = await response.json().catch(() => ({}));
    setMessage(body.message ?? "Se esse e-mail estiver cadastrado, enviamos um link.");
    setBusy(false);
  }

  return (
    <form className="form card card--pad" onSubmit={submit}>
      {message && (
        <div className="flashes">
          <p className="flash flash--success">{message}</p>
        </div>
      )}

      <label className="field">
        <span>E-mail da conta</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <p className="muted">
        Este projeto roda só na sua máquina e não envia e-mail de verdade. A mensagem
        aparece na <Link href="/caixa-de-entrada">caixa de entrada simulada</Link>.
      </p>

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Enviando..." : "Enviar link"}
        </button>
        <Link className="btn btn--ghost" href="/login">
          Voltar
        </Link>
      </div>
    </form>
  );
}
