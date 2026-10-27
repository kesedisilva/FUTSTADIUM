"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteMatch({ match }) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  async function remove() {
    const label = `${match.homeTeamName} ${match.homeScore} × ${match.awayScore} ${match.awayTeamName}`;
    if (!window.confirm(`Excluir o jogo ${label}?`)) {
      return;
    }

    setRemoving(true);
    const response = await fetch(`/api/matches/${match.id}`, { method: "DELETE" });

    if (!response.ok) {
      window.alert("Não foi possível excluir o jogo.");
      setRemoving(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      className="btn btn--danger btn--small"
      type="button"
      onClick={remove}
      disabled={removing}
    >
      Excluir
    </button>
  );
}
