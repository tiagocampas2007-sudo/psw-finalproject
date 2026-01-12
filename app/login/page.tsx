"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/auth/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-layout">
      <div className="login-form-wrapper">
        <div className="login-form">
          <div className="login-logo">
            <Image src="/logo.png" alt="Torq" width={150} height={100} />
          </div>

          <h1 className="login-title">Entre na sua conta</h1>

          <p className="login-subtitle">
            Por favor insira as suas credenciais.
          </p>

          <form className="login-fields">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Palavra-passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <p className="login-footer">
            Não tem uma conta?{" "}
            <Link href="/register">Registe-se</Link>
          </p>
        </div>
      </div>

      <div className="login-image">
        <Image
          src="/login/background.jpg"
          alt="Login background"
          fill
          priority
        />
        <div className="login-image-overlay" />
      </div>
    </div>
  );
}
