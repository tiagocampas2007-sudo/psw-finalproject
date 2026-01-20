"use client";

import Navbar from "./navbar";

export default function NavbarSlot() {
  return (
    <Navbar
      workshopName="TORQ"
      user={{ name: "Tomé Almeida", role: "Admin Oficina"}}
      onLogout={() => {
        console.log("Logout");
      }}
    />
  );
}
