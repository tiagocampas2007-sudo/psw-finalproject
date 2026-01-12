"use client";

import BrandSlider from "@/components/sliders/BrandSlider";
import "@/styles/home.css";

export default function HomePage() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: "url('/login/background.jpg')" }}
        />
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-eyebrow">Oficina Automóvel</span>

          <h1 className="hero-title">TORQ</h1>

          <p className="hero-description">
            A TORQ é uma oficina automóvel moderna, focada na manutenção,
            diagnóstico e cuidado profissional do seu veículo, com transparência
            e confiança em cada serviço.
          </p>

          <div className="hero-actions">
            <a href="/login" className="btn-primary">
              Marcar Serviço
            </a>

            <a href="#sobre" className="btn-outline">
              Conhecer a oficina
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="section">
        <h2 className="section-title">Sobre a TORQ</h2>

        <div className="two-cols">
          <p>
            A TORQ nasce com o objetivo de oferecer um serviço automóvel claro,
            honesto e tecnicamente rigoroso. Apostamos numa abordagem moderna,
            aliando experiência mecânica a ferramentas de diagnóstico avançadas.
          </p>

          <p>
            Trabalhamos com foco na segurança, fiabilidade e desempenho do seu
            veículo, garantindo que cada intervenção é explicada e executada com
            total transparência.
          </p>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="section section-muted">
        <h2 className="section-title">Serviços Disponíveis</h2>

        <div className="services-grid">
          {[
            {
              title: "Manutenção Geral",
              desc: "Revisões periódicas e manutenção preventiva para garantir a fiabilidade do seu veículo.",
            },
            {
              title: "Diagnóstico Eletrónico",
              desc: "Leitura e análise de sistemas eletrónicos com equipamento profissional.",
            },
            {
              title: "Travões e Suspensão",
              desc: "Inspeção e substituição de componentes essenciais para a segurança.",
            },
            {
              title: "Troca de Óleo",
              desc: "Mudança de óleo e filtros com produtos adequados a cada motor.",
            },
            {
              title: "Revisões Programadas",
              desc: "Serviços de acordo com os planos de manutenção do fabricante.",
            },
            {
              title: "Preparação e Inspeção",
              desc: "Preparação do veículo para inspeção periódica obrigatória.",
            },
          ].map((service) => (
            <div key={service.title} className="service-card">
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARCAS */}
      <section className="section">
        <h2 className="section-title">Marcas com que trabalhamos</h2>

        <p className="section-description">
          Trabalhamos com uma vasta gama de marcas, utilizando peças e
          procedimentos adequados a cada fabricante.
        </p>

        <BrandSlider />
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <h2>Pronto para cuidar do seu veículo?</h2>

        <p>
          Faça a sua marcação online de forma simples, rápida e sem compromisso.
        </p>

        <a href="/login" className="btn-primary">
          Marcar serviço
        </a>
      </section>
    </main>
  );
}
