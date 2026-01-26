"use client";

import "@/styles/dashboard.css";
import ServicesTable from "@/components/dashboard/ServicesTable";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import MechanicsTable from "@/components/dashboard/MechanicsTable";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {

  const { user } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard · {user?.office?.name}</h1>
        <p>Visão geral da atividade diária</p>
      </header>

      <main className="dashboard-main">
        
        <ServicesTable />

        <AppointmentsTable />

        <MechanicsTable />
        
      </main>
    </div>
  );
}
