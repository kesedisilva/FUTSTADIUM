import { Archivo, Inter } from "next/font/google";
import Link from "next/link";
import Logout from "../components/Logout";
import Nav from "../components/Nav";
import { getCurrentUser } from "../lib/session";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata = {
  title: "Caderno de Jogos",
  description: "Registro dos jogos que você foi assistir no estádio",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-br" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            <span>CJ</span>
            Caderno de Jogos
          </Link>

          {user && <Nav />}

          <div className="topbar__end">
            {user ? (
              <>
                <span className="muted">{user.name}</span>
                <Logout />
              </>
            ) : (
              <Link className="btn btn--ghost btn--small" href="/login">
                Entrar
              </Link>
            )}
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
