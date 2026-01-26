"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut, ChevronDown, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "@/styles/layout/navbar.css";

export interface NavbarItem {
  label: string;
  href: string;
}

const NAV_ITEMS_BY_ROLE: Record<string, NavbarItem[]> = {
  CLIENT: [    
    { label: "Procurar serviços", href: "/services" },
    { label: "Marcações", href: "/appointments" },
    { label: "As minhas marcações", href: "/my-appointments" },
    { label: "A minha garagem", href: "/garage" },
  ],
  ADMIN: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Serviços", href: "/services" },
    { label: "Procurar mecânicos", href: "/mechanics" },
  ],
  STAFF: [
    { label: "Agenda", href: "/agenda" },
    { label: "Serviços", href: "/services" },
    { label: "Marcações", href: "/appointments" },
    { label: "As minhas marcações", href: "/my-appointments" },
    { label: "A minha garagem", href: "/garage" },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Cliente",
  STAFF: "Mecânico",
  ADMIN: "Administrador",
};

function getRoleLabel(role: string, office?: { name: string } | null) {
  const base = ROLE_LABELS[role] ?? role;
  return office?.name ? `${base} · ${office.name}` : base;
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-workshop">
          <Link href="/">TORQ</Link>
        </h1>
      </div>

      <nav className="navbar-center">
        {!loading &&
          user &&
          (NAV_ITEMS_BY_ROLE[user.role] ?? []).map((item) => (
            <Link key={item.href} href={item.href} className="navbar-link">
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="navbar-right">
        {!loading && user ? (
          <div className="user-dropdown">
            <button
              type="button"
              className="navbar-user"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  {getRoleLabel(user.role, user.office)}
                </span>
              </div>

              <ChevronDown
                size={16}
                className={`dropdown-arrow ${open ? "open" : ""}`}
              />
            </button>

            {open && (
              <div className="dropdown-menu">
                <Link
                  href="/profile"
                  className="dropdown-item"
                  onClick={() => setOpen(false)}
                >
                  <User size={16} />
                  Ver perfil
                </Link>

                <button
                  className="dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Terminar sessão
                </button>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div className="navbar-auth">
              <Link href="/login" className="navbar-link">
                Login
              </Link>
              <Link href="/register" className="navbar-link">
                Registar
              </Link>
            </div>
          )
        )}
      </div>
    </header>
  );
}
