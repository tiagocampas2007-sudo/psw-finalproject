"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import "@/styles/layout/navbar.css";

export interface NavbarItem {
  label: string;
  href: string;
}

const NAV_ITEMS_BY_ROLE: Record<string, NavbarItem[]> = {
  CLIENT: [
    { label: "A minha garagem", href: "/garage" },
    { label: "Marcações", href: "/appointments" },
  ],
  ADMIN_OFFICE: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Ordens", href: "/orders" },
    { label: "Agenda", href: "/calendar" },
    { label: "Serviços", href: "/services" },
  ],
  STAFF: [
    { label: "Agenda", href: "/calendar" },
    { label: "Ordens", href: "/orders" },
  ],
};

const ROLE_LABELS: Record<string, string> = {
  CLIENT: "Cliente",
  STAFF: "Staff",
  ADMIN_OFFICE: "Administrador",
};

function getRoleLabel(
  role: string,
  office?: { name: string } | null
) {
  const base = ROLE_LABELS[role] ?? role;

  if (office?.name) {
    return `${base} - ${office.name}`;
  }

  return base;
}

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-workshop">TORQ</h1>
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
          <>
            <div className="navbar-user">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{getRoleLabel(user.role, user.office)}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut className="icon" />
            </button>
          </>
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
