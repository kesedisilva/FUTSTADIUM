import Link from "next/link";
import { listEmails } from "../../lib/passwordReset";

export const dynamic = "force-dynamic";

export default function Inbox() {
  const emails = listEmails();

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Caixa de entrada</h1>
          <p>Simulação local: o projeto não envia e-mail de verdade</p>
        </div>
      </div>

      {emails.length > 0 ? (
        <div className="stack">
          {emails.map((email) => (
            <div className="card card--pad" key={email.id}>
              <div className="muted">
                Para {email.recipient} · {email.created_at}
              </div>
              <h2 style={{ margin: "8px 0 10px" }}>{email.subject}</h2>
              <p style={{ marginBottom: 16 }}>{email.body}</p>
              {email.link && (
                <Link className="btn btn--primary" href={email.link}>
                  Abrir link de redefinição
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty">
          <div className="empty__mark">📭</div>
          <h3>Nenhuma mensagem</h3>
          <p>Peça um link em &quot;Esqueci minha senha&quot; e ele aparece aqui.</p>
          <Link className="btn btn--primary" href="/esqueci-senha">
            Esqueci minha senha
          </Link>
        </div>
      )}
    </main>
  );
}
