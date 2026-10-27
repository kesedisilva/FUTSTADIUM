"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  async function leave() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="btn btn--ghost btn--small" type="button" onClick={leave}>
      Sair
    </button>
  );
}
