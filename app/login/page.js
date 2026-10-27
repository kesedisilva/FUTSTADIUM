import LoginForm from "../../components/LoginForm";

export const dynamic = "force-dynamic";

export default function Login() {
  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Entrar</h1>
          <p>Acesse o seu caderno de jogos</p>
        </div>
      </div>
      <LoginForm />
    </main>
  );
}
