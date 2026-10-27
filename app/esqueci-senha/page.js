import ForgotForm from "../../components/ForgotForm";

export const dynamic = "force-dynamic";

export default function Forgot() {
  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Esqueci minha senha</h1>
          <p>Informe o e-mail da conta e enviaremos um link de redefinição</p>
        </div>
      </div>
      <ForgotForm />
    </main>
  );
}
