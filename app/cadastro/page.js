import RegisterForm from "../../components/RegisterForm";
import { getCatalog } from "../../lib/matches";

export const dynamic = "force-dynamic";

export default function Register() {
  const { teams } = getCatalog();

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Criar conta</h1>
          <p>Escolha o seu time do coração para começar</p>
        </div>
      </div>
      <RegisterForm teams={teams} />
    </main>
  );
}
