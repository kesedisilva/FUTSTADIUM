"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Painel" },
  { href: "/jogos", label: "Jogos" },
  { href: "/perfil", label: "Perfil" },
];

export default function Nav() {
  const pathname = usePathname();

  function isActive(href) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <nav className="nav">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isActive(link.href) ? "is-active" : ""}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
