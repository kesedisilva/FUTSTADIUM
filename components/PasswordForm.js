"use client";

import { useState } from "react";
import PasswordField from "./PasswordField";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setErrors([]);
    setMessage(null);

    const response = await fetch("/api/profile/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, newPasswordConfirmation }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setErrors(body.errors ?? ["Não foi possível trocar a senha."]);
      setBusy(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirmation("");
    setMessage("Senha alterada. Use a nova senha no próximo login.");
    setBusy(false);
  }

  return (
    <form className="form card card--pad" onSubmit={submit}>
      <h2 style={{ marginBottom: 18 }}>Trocar senha</h2>

      {errors.length > 0 && (
        <div className="flashes">
          {errors.map((text) => (
            <p className="flash flash--error" key={text}>{text}</p>
          ))}
        </div>
      )}
      {message && (
        <div className="flashes">
          <p className="flash flash--success">{message}</p>
        </div>
      )}

      <PasswordField
        label="Senha atual"
        value={currentPassword}
        onChange={setCurrentPassword}
      />

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
        <button className="btn btn--primary" type="submit" disabled={busy}>
          {busy ? "Salvando..." : "Trocar senha"}
        </button>
      </div>
    </form>
  );
}
