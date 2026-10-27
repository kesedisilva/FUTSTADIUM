"use client";

import Link from "next/link";
import PasswordField from "./PasswordField";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm({ teams }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [teamId, setTeamId] = useState("");
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, passwordConfirmation, teamId }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível criar a conta."]);
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
        <span>Nome</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className="field">
        <span>E-mail</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <div className="field--inline">
        <PasswordField
          label="Senha"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          minLength={6}
        />
        <PasswordField
          label="Confirmar senha"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          autoComplete="new-password"
          minLength={6}
        />
      </div>

      <label className="field">
        <span>Time do coração</span>
        <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
          <option value="">Selecione o seu time</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </label>

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Criando..." : "Criar conta"}
        </button>
        <Link className="btn btn--ghost" href="/login">Já tenho conta</Link>
      </div>
    </form>
  );
}
