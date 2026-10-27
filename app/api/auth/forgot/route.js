import {
  createResetToken,
  findUserByEmail,
  recordEmail,
} from "../../../../lib/passwordReset.js";

export async function POST(request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const user = findUserByEmail(email);

  if (user) {
    const token = createResetToken(user.id);
    const link = `/redefinir-senha?token=${token}`;
    recordEmail(
      user.email,
      "Redefinir sua senha no Caderno de Jogos",
      `Olá, ${user.name}. Recebemos um pedido para redefinir a sua senha. O link abaixo vale por 30 minutos e só pode ser usado uma vez. Se não foi você, ignore esta mensagem.`,
      link,
    );
  }

  return Response.json({
    message: "Se esse e-mail estiver cadastrado, enviamos um link de redefinição.",
  });
}
