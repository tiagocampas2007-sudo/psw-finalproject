"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock, Euro, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

import { getServices } from "@/lib/api";
import type { ServicePage } from "@/lib/api";
import { getServiceTypeIcon } from "@/lib/serviceTypeIcons";

import "@/styles/services.css";

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export default function Services() {
  const [services, setServices] = useState<ServicePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return services;

    return services.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.office.name.toLowerCase().includes(q)
    );
  }, [services, search]);

  return (
    <>
      <section className="services-hero">
        <div className="services-container">
          <div className="services-hero-content">
            <p className="services-eyebrow">Catálogo de Serviços</p>
            <h1 className="services-title">Serviços disponíveis</h1>
            <p className="services-subtitle">
              Conheça os serviços oferecidos pelas nossas oficinas parceiras.
              Preços e disponibilidade podem variar conforme a oficina.
            </p>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="services-container">
          <div className="services-filter">
            <Search size={18} />
            <input
              type="text"
              placeholder="Pesquisar serviço ou oficina…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        {loading && <p>A carregar serviços…</p>}

        {!loading && filteredServices.length === 0 && (
        <p>Nenhum serviço encontrado.</p>
        )}

        {!loading && filteredServices.length > 0 && (
        <div className="services-grid">
            {filteredServices.map((service, index) => {
            const Icon = getServiceTypeIcon(service.serviceTypeId?.slug);

            return (
                <div key={service._id} className="service-card">
                <div className="service-card-header">
                    <div className="service-office">
                    <div className="service-icon">
                        <Icon size={24} />
                    </div>
                    <h2 className="service-title">
                        {service.office.name}
                    </h2>
                    </div>

                    <span className="service-index">
                    {(index + 1).toString().padStart(2, "0")}
                    </span>
                </div>

                <h2 className="service-name">{service.name}</h2>

                <p className="service-description">
                    {service.description}
                </p>

                <div className="service-meta">
                    <div className="service-meta-item">
                    <Clock size={16} />
                    <span>
                        {formatDuration(service.durationMinutes)}
                    </span>
                    </div>

                    <div className="service-meta-item">
                    <Euro size={16} />
                    <span>Desde {service.price}€</span>
                    </div>
                </div>

                <Link
                    href={`/marcacoes?service=${service._id}`}
                    className="service-action"
                >
                    Agendar
                    <ArrowRight size={16} />
                </Link>
                </div>
            );
            })}
        </div>
        )}

        </div>
      </section>
    </>
  );
}
