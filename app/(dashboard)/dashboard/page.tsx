"use client";

import { Wrench, Car, Euro, ClipboardList } from "lucide-react";

import "@/styles/dashboard.css";
import ServicesTable from "@/components/dashboard/ServicesTable";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const stats = [
    {
      title: "Ordens Ativas",
      value: 12,
      icon: ClipboardList,
    },
    {
      title: "Carros em Oficina",
      value: 8,
      icon: Car,
    },
    {
      title: "Faturação (mês)",
      value: "4.250€",
      icon: Euro,
    },
    {
      title: "Serviços Hoje",
      value: 5,
      icon: Wrench,
    },
  ];

  const { user } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard · {user?.office?.name}</h1>
        <p>Visão geral da atividade diária</p>
      </header>

      <main className="dashboard-main">
        <section className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.title} className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <stat.icon className="stat-icon" />
              </div>
            </div>
          ))}
        </section>
        
        <ServicesTable />
      </main>
    </div>
  );
}
