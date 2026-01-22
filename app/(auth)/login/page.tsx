"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser } from "@/lib/api";

import "@/styles/auth/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const { refresh } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    setLoading(true);

    try {
      await loginUser({ email, password });
      await refresh();
      showToast("Login efetuado com sucesso.", "success");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao efetuar login.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

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

          <form className="login-fields" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
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
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "A entrar..." : "Login"}
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
