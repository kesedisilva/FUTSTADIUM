"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfileForm({ teams, user }) {
  const router = useRouter();
  const [teamId, setTeamId] = useState(String(user.teamId));
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);
    setMessage(null);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível salvar."]);
      setBusy(false);
      return;
    }

    setMessage("Time do coração atualizado. Os jogos já registrados continuam como estavam.");
    setBusy(false);
    router.refresh();
  }

  return (
    <form className="form card card--pad" onSubmit={submit}>
      {errors.map((text) => (
        <div className="flashes" key={text}>
          <p className="flash flash--error">{text}</p>
        </div>
      ))}
      {message && (
        <div className="flashes">
          <p className="flash flash--success">{message}</p>
        </div>
      )}

      <label className="field">
        <span>Time do coração</span>
        <select value={teamId} onChange={(e) => setTeamId(e.target.value)} required>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </label>

      <div className="form__footer">
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
