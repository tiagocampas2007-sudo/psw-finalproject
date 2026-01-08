"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[680px_1fr]">
      
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">

          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="Torq" width={100} height={100} />
          </div>

          <h1 className="text-3xl font-bold text-neutral-900 text-center">
            Entre na sua conta
          </h1>

          <p className="text-neutral-500 text-center mt-2">
            Por favor insira as suas credenciais.
          </p>

          <form className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Insira o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full h-12">
              Login
            </Button>
          </form>

          <p className="text-sm text-neutral-500 text-center mt-6">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-neutral-900 hover:underline">
              Registe-se
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
