import ResetForm from "../../components/ResetForm";

export const dynamic = "force-dynamic";

export default async function Reset({ searchParams }) {
  const { token } = await searchParams;

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Nova senha</h1>
          <p>Escolha uma senha para voltar a acessar a sua conta</p>
        </div>
      </div>

      {token ? (
        <ResetForm token={token} />
      ) : (
        <div className="card empty">
          <div className="empty__mark">🔗</div>
          <h3>Link sem token</h3>
          <p>Abra o link que está na caixa de entrada para redefinir a senha.</p>
        </div>
      )}
    </main>
  );
}
