"use client";

import { useState } from "react";

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete = "current-password",
  minLength,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field">
      <span>{label}</span>
      <div className="password">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          className="password__toggle"
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          title={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 6.5c3.8 0 7 2.3 8.5 5.5-.6 1.3-1.6 2.5-2.7 3.4l1.5 1.5c1.5-1.3 2.7-2.9 3.4-4.9C21 8 16.9 4.5 12 4.5c-1.3 0-2.6.3-3.8.7l1.7 1.7c.7-.2 1.4-.4 2.1-.4ZM3.3 3.3 1.9 4.7l2.5 2.5C2.9 8.4 1.7 10.1 1 12c1.7 4 5.8 7.5 11 7.5 1.9 0 3.7-.5 5.2-1.3l3.1 3.1 1.4-1.4L3.3 3.3Zm6.2 6.2 2.9 2.9a1.8 1.8 0 0 1-2.9-2.9Zm-2-2 1.4 1.4a3.8 3.8 0 0 0 5.2 5.2l1.1 1.1c-1 .4-2.1.6-3.2.6-3.8 0-7-2.3-8.5-5.5.8-1.6 2.1-2.9 3.6-3.8Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4.5C7.1 4.5 3 8 1 12c2 4 6.1 7.5 11 7.5S21 16 23 12c-2-4-6.1-7.5-11-7.5Zm0 12.5c-3.8 0-7-2.3-8.5-5.5C5 8.3 8.2 6 12 6s7 2.3 8.5 5.5C19 14.7 15.8 17 12 17Zm0-8.3a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm0 5a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4Z" />
            </svg>
          )}
        </button>
      </div>
    </label>
  );
}
