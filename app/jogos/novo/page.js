import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../lib/session";
import MatchForm from "../../../components/MatchForm";
import { getCatalog } from "../../../lib/matches";

export const dynamic = "force-dynamic";

export default async function NewMatch() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const catalog = getCatalog();

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Novo jogo</h1>
          <p>Registre um jogo que você foi assistir no estádio</p>
        </div>
      </div>

      <MatchForm catalog={catalog} user={user} />
    </main>
  );
}
