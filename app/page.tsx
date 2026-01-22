"use client";

import Navbar from "@/components/common/Navbar";
import Image from "next/image";
import { Calendar, UsersRound, Clock, Settings } from "lucide-react";
import "@/styles/home.css";
import BrandSlider from "@/components/sliders/BrandSlider";

export default function HomePage() {
  return (
    <>
      <Navbar/>

      <main>
        <section className="section-p hero-content">
          <div>
            <span className="eyebrow">TORQ</span>

            <h1>
              Gestão de Oficinas
              <span>Simplificada</span>
            </h1>

            <p>
              Agende serviços para o seu veículo, consulte histórico e
              gerencie marcações numa única plataforma.
            </p>

            <div className="actions">
              <button>
                Agendar Serviço
                <span>→</span>
              </button>
              <a href="#">Ver Oficinas</a>
            </div>
          </div>

          <Image 
            src="/login/background.jpg" 
            alt="TORQ" 
            className="hero-img"
            width={800} 
            height={500}
          />
        </section>

        <div className="stats">
          <div className="stat">
            <strong>50+</strong>
            <span>OFICINAS</span>
          </div>
          <div className="stat">
            <strong>1000+</strong>
            <span>CLIENTES</span>
          </div>
          <div className="stat">
            <strong>500+</strong>
            <span>SERVIÇOS</span>
          </div>
          <div className="stat">
            <strong>99%</strong>
            <span>SATISFAÇÃO</span>
          </div>
        </div>

        <section className="section-p features">
          <div className="features-header">
            <span className="eyebrow">FUNCIONALIDADES</span>

            <h2>
              Tudo o que precisa numa única plataforma
            </h2>

            <p>
              Desenvolvida para simplificar a gestão de serviços automóveis,
              conectando clientes e oficinas de forma eficiente.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature">
              <Calendar size={32} />
              <h3>Agendamento Online</h3>
              <p>
                Marque serviços para o seu veículo de forma rápida e simples,
                24/7.
              </p>
            </div>

            <div className="feature">
              <Settings size={32} />
              <h3>Múltiplos Serviços</h3>
              <p>
                Revisões, troca de óleo, diagnósticos e muito mais disponíveis.
              </p>
            </div>

            <div className="feature">
              <UsersRound size={32} />
              <h3>Mecânicos Qualificados</h3>
              <p>
                Equipa de profissionais experientes ao seu serviço.
              </p>
            </div>

            <div className="feature">
              <Clock size={32} />
              <h3>Gestão de Horários</h3>
              <p>
                Escolha o turno mais conveniente para si.
              </p>
            </div>
          </div>
        </section>

        <BrandSlider />

        <section className="section-p how">
          <div className="how-left">
            <span className="eyebrow">COMO FUNCIONA</span>

            <h2>
              3 passos simples
            </h2>

            <div className="steps">
              <div className="step">
                <div className="step-number">01</div>
                <div>
                  <h3>Escolha a Oficina</h3>
                  <p>
                    Encontre a oficina mais próxima com os serviços que precisa.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">02</div>
                <div>
                  <h3>Selecione o Serviço</h3>
                  <p>
                    Escolha entre revisões, diagnósticos, manutenção e mais.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">03</div>
                <div>
                  <h3>Agende a Data</h3>
                  <p>
                    Selecione o turno disponível que melhor se adequa.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="how-right">
            <div className="mock">
              <div className="mock-item">
                <span className="mock-icon">
                  <UsersRound size={18} />
                </span>
                Oficina Central - Viseu
              </div>

              <div className="mock-item">
                <span className="mock-icon">
                  <Settings size={18} />
                </span>
                Revisão Completa
              </div>

              <div className="mock-item">
                <span className="mock-icon">
                  <Calendar size={18} />
                </span>
                20 Jan 2026 - 10:00
              </div>

              <div className="mock-confirm">
                <Clock size={18} />
                Marcação Confirmada
              </div>
            </div>
          </div>
        </section>

        <div className="cta">
          <h2>Pronto para começar?</h2>

          <p>
            Registe-se agora e agende o primeiro serviço para o seu veículo.
          </p>

          <div className="cta-actions">
            <button className="cta-primary">
              Agendar Serviço
              <span>→</span>
            </button>

            <button className="cta-secondary">
              Explorar Oficinas
            </button>
          </div>
        </div>

      </main>
    </>
  );
}
