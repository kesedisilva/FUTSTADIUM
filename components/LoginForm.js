"use client";

import Link from "next/link";
import PasswordField from "./PasswordField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível entrar."]);
      setBusy(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form className="form card card--pad" onSubmit={submit}>
      {errors.length > 0 && (
        <div className="flashes">
          {errors.map((message) => (
            <p className="flash flash--error" key={message}>{message}</p>
          ))}
        </div>
      )}

      <label className="field">
        <span>E-mail</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <PasswordField label="Senha" value={password} onChange={setPassword} />

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>
        <Link className="btn btn--ghost" href="/cadastro">Criar conta</Link>
        <Link className="btn btn--ghost" href="/esqueci-senha">Esqueci minha senha</Link>
      </div>
    </form>
  );
}
