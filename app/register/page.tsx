"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/auth/register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validation = useMemo(() => {
    if (!password && !confirmPassword) {
      return {
        valid: false,
        message: "A palavra-passe deve ter pelo menos 8 caracteres.",
      };
    }

    if (password.length < 8) {
      return {
        valid: false,
        message: "A palavra-passe deve ter pelo menos 8 caracteres.",
      };
    }

    if (password !== confirmPassword) {
      return {
        valid: false,
        message: "As palavras-passe não coincidem.",
      };
    }

    return {
      valid: true,
      message: "Palavra-passe válida.",
    };
  }, [password, confirmPassword]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validation.valid) return;

    console.log({ name, email, password });
  }

  return (
    <div className="register-layout">
      <div className="register-form-wrapper">
        <div className="register-form">
          <div className="register-logo">
            <Image src="/logo.png" alt="Torq" width={150} height={100} />
          </div>

          <h1 className="register-title">Registe-se na TORQ</h1>

          <p className="register-subtitle">Entre na nossa família.</p>

          <form onSubmit={handleSubmit} className="register-fields">
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Palavra-passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">
                Confirmar Palavra-passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div
              className={`password-validation ${
                validation.valid ? "valid" : "invalid"
              }`}
            >
              {validation.valid ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{validation.message}</span>
            </div>

            <button type="submit" disabled={!validation.valid}>
              Criar conta
            </button>
          </form>

          <p className="register-footer">
            Já tem conta? <Link href="/login">Faça login</Link>
          </p>
        </div>
      </div>

      <div className="register-image">
        <Image
          src="/login/background.jpg"
          alt="Register background"
          fill
          priority
        />
        <div className="register-image-overlay" />
      </div>
    </div>
  );
}
