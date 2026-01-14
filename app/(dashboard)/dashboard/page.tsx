import { Wrench, Car, Euro, ClipboardList } from "lucide-react";

import "@/styles/dashboard.css";

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

  const recentOrders = [
    {
      id: "#OF-1023",
      client: "João Silva",
      car: "VW Golf 4 1.9 TDI",
      service: "Revisão Geral",
      status: "Em progresso",
    },
    {
      id: "#OF-1022",
      client: "Maria Costa",
      car: "BMW Série 1",
      service: "Troca de Travões",
      status: "Concluído",
    },
    {
      id: "#OF-1021",
      client: "Pedro Rocha",
      car: "Audi A3",
      service: "Diagnóstico",
      status: "Aguarda peças",
    },
  ];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard · Oficina Auto</h1>
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

        <section className="orders-card">
          <div className="orders-header">
            <h2>Serviços Recentes</h2>
          </div>

          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-row">
                <div>
                  <p className="order-main">
                    {order.car} · {order.service}
                  </p>
                  <p className="order-sub">
                    {order.id} — {order.client}
                  </p>
                </div>

                <span className="order-status">{order.status}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
