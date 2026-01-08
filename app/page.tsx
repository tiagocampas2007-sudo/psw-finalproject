"use client";

import BrandSlider from "@/components/sliders/BrandSlider";

export default function HomePage() {
  return (
    <main className="bg-zinc-50 text-zinc-900">
      {/* HERO */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login/background.jpg')" }}
        />
        <div className="absolute inset-0 bg-zinc-900/60" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <span className="text-sm tracking-widest text-zinc-300 uppercase">
            Oficina Automóvel
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight text-white">
            TORQ
          </h1>

          <p className="mt-6 text-zinc-200 text-base sm:text-lg">
            A TORQ é uma oficina automóvel moderna, focada na manutenção,
            diagnóstico e cuidado profissional do seu veículo, com transparência
            e confiança em cada serviço.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/login"
              className="rounded-lg bg-white text-zinc-900 px-6 py-3 text-sm font-medium hover:bg-zinc-100 transition"
            >
              Marcar Serviço
            </a>

            <a
              href="#sobre"
              className="rounded-lg border border-white/30 text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition"
            >
              Conhecer a oficina
            </a>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section
        id="sobre"
        className="py-24 px-6 max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Sobre a TORQ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <p className="text-zinc-600 leading-relaxed">
            A TORQ nasce com o objetivo de oferecer um serviço automóvel claro,
            honesto e tecnicamente rigoroso. Apostamos numa abordagem moderna,
            aliando experiência mecânica a ferramentas de diagnóstico avançadas.
          </p>

          <p className="text-zinc-600 leading-relaxed">
            Trabalhamos com foco na segurança, fiabilidade e desempenho do seu
            veículo, garantindo que cada intervenção é explicada e executada com
            total transparência.
          </p>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section
        id="servicos"
        className="py-24 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-12">
            Serviços Disponíveis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
              <div
                key={service.title}
                className="rounded-xl border bg-zinc-50 p-6 hover:shadow-sm transition"
              >
                <h3 className="font-medium mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-600">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">
            Marcas com que trabalhamos
          </h2>

          <p className="text-zinc-600 max-w-3xl mb-8">
            Trabalhamos com uma vasta gama de marcas, utilizando peças e
            procedimentos adequados a cada fabricante.
          </p>

          <BrandSlider />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-zinc-900 text-white text-center">
        <h2 className="text-2xl font-semibold">
          Pronto para cuidar do seu veículo?
        </h2>

        <p className="mt-4 text-zinc-300 max-w-xl mx-auto">
          Faça a sua marcação online de forma simples, rápida e sem compromisso.
        </p>

        <a
          href="/login"
          className="inline-block mt-8 rounded-lg bg-white text-zinc-900 px-6 py-3 text-sm font-medium hover:bg-zinc-100 transition"
        >
          Marcar serviço
        </a>
      </section>
    </main>
  );
}
