"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[680px_1fr]">
      
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Torq" width={100} height={100} />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 text-center">
            Registe-se na TORQ
          </h1>

          <p className="text-neutral-500 text-center mt-2">
            Entre na nossa família.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Palavra-passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div
              className={`flex items-center gap-2 text-sm ${
                validation.valid ? "text-green-600" : "text-red-600"
              }`}
            >
              {validation.valid ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
              )}
              <span>{validation.message}</span>
            </div>

            <Button
              type="submit"
              className="w-full h-12"
              disabled={!validation.valid}
            >
              Criar conta
            </Button>
          </form>

          <p className="text-sm text-neutral-500 text-center mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-neutral-900 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <Image
          src="/login/background.jpg"
          alt="Login background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
