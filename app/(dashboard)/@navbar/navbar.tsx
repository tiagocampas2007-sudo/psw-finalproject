import Link from "next/link";
import { LogOut } from "lucide-react";
import "@/styles/layout/navbar.css";

export interface UserData {
  name: string;
  role: string;
}

export interface NavbarItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  workshopName: string;
  user: UserData;
  items?: NavbarItem[];
  onLogout?: () => void;
}

export default function Navbar({
  workshopName,
  user,
  items = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Ordens", href: "/orders" },
    { label: "Agenda", href: "/calendar" },
    { label: "Serviços", href: "/services" },
  ],
  onLogout,
}: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-workshop">{workshopName}</span>
      </div>

      <nav className="navbar-center">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="navbar-link">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="navbar-right">
        <div className="user-dropdown">
          <div className="navbar-user">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role}</span>
          </div>

          <div className="dropdown-menu">
            <button onClick={onLogout}><LogOut className="icon" /> Terminar sessão</button>
          </div>
        </div>
      </div>
    </header>
  );
}
