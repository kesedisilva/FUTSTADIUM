import { redirect } from "next/navigation";
import PasswordForm from "../../components/PasswordForm";
import ProfileForm from "../../components/ProfileForm";
import { getCatalog } from "../../lib/matches";
import { getCurrentUser } from "../../lib/session";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { teams } = getCatalog();
  const team = teams.find((item) => item.id === user.teamId);

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>{user.name}</h1>
          <p>{user.email} · torce para o {team ? team.name : "—"}</p>
        </div>
      </div>
      <div className="stack">
        <ProfileForm teams={teams} user={user} />
        <PasswordForm />
      </div>
    </main>
  );
}
