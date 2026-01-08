import { Wrench, Car, Euro, ClipboardList } from "lucide-react";
import BrandSlider from "@/components/sliders/BrandSlider";

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
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-8 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          Dashboard · Oficina Auto
        </h1>
        <p className="text-sm text-zinc-500">
          Visão geral da atividade diária
        </p>
      </header>

      <main className="px-8 py-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{stat.title}</p>
                  <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 text-zinc-400" />
              </div>
            </div>
          ))}
        </section>

        {/* Recent Orders */}
        <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="text-lg font-semibold">Serviços Recentes</h2>
          </div>

          <div className="divide-y divide-zinc-200">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {order.car} · {order.service}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {order.id} — {order.client}
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section>
          <BrandSlider />
        </section>
      </main>
    </div>
  );
}
