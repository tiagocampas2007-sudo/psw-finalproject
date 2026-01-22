"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User2Icon, Building2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import "@/styles/auth/register.css";

import { registerUser, registerOffice } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

import UserForm from "@/components/register/UserForm";
import OfficeForm from "@/components/register/OfficeForm";

type AccountType = "USER" | "OFFICE";

export default function Register() {
  const router = useRouter();
  const { showToast } = useToast();

  const [accountType, setAccountType] = useState<AccountType>("USER");
  const [loading, setLoading] = useState(false);

  // user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // office
  const [officeName, setOfficeName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState<number | "">("");
  const [openingMinutes, setOpeningMinutes] = useState<number | "">("");
  const [closingMinutes, setClosingMinutes] = useState<number | "">("");

  const passwordValidation = useMemo(() => {
    if (!password && !confirmPassword) {
      return {
        valid: false,
        message: "A palavra-passe deve ter pelo menos 8 caracteres.",
      };
    }

    if (password.trim().length < 8) {
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

  function validateOffice() {
    if (
      !officeName.trim() ||
      !location.trim() ||
      phone === "" ||
      openingMinutes === "" ||
      closingMinutes === ""
    ) {
      showToast("Preencha todos os dados da oficina.", "error");
      return false;
    }

    if (openingMinutes < 0 || openingMinutes > 1440) {
      showToast("Hora de abertura inválida.", "error");
      return false;
    }

    if (closingMinutes < 0 || closingMinutes > 1440) {
      showToast("Hora de fecho inválida.", "error");
      return false;
    }

    if (closingMinutes <= openingMinutes) {
      showToast("A hora de fecho deve ser superior à de abertura.", "error");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast("Preencha os dados do utilizador.", "error");
      return;
    }

    if (!passwordValidation.valid) {
      showToast(passwordValidation.message, "error");
      return;
    }

    if (accountType === "OFFICE" && !validateOffice()) {
      return;
    }

    setLoading(true);

    try {
      if (accountType === "USER") {
        await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      } else {
        await registerOffice({
          name: name.trim(),
          email: email.trim(),
          password,

          officeName: officeName.trim(),
          location: location.trim(),
          phone: Number(phone),
          openingMinutes: Number(openingMinutes),
          closingMinutes: Number(closingMinutes),
        });
      }

      showToast("Conta criada com sucesso!", "success");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message, "error");
      } else {
        showToast("Erro ao criar conta.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-layout">
      <div className="register-form-wrapper">
        <div className="register-form">
          <h1 className="register-title">Criar conta</h1>
          <p className="register-subtitle">
            Escolha o tipo de conta e preencha os dados.
          </p>

          <div className="register-tabs">
            <button
              type="button"
              className={`register-tab ${accountType === "USER" ? "active" : ""}`}
              onClick={() => setAccountType("USER")}
            >
              <User2Icon size={20} />
              Cliente
            </button>

            <button
              type="button"
              className={`register-tab ${accountType === "OFFICE" ? "active" : ""}`}
              onClick={() => setAccountType("OFFICE")}
            >
              <Building2Icon size={20} />
              Oficina
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`register-fields ${
              accountType === "OFFICE" ? "office-layout" : ""
            }`}
          >
            <UserForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
            />

            {accountType === "OFFICE" && (
              <OfficeForm
                officeName={officeName}
                setOfficeName={setOfficeName}
                location={location}
                setLocation={setLocation}
                phone={phone}
                setPhone={setPhone}
                openingMinutes={openingMinutes}
                setOpeningMinutes={setOpeningMinutes}
                closingMinutes={closingMinutes}
                setClosingMinutes={setClosingMinutes}
                loading={loading}
              />
            )}

            <div
              className={`password-validation field-full ${
                passwordValidation.valid ? "valid" : "invalid"
              }`}
            >
              {passwordValidation.message}
            </div>

            <button
              type="submit"
              className="field-full"
              disabled={!passwordValidation.valid || loading}
            >
              {loading ? "A criar conta..." : "Criar conta"}
            </button>
          </form>

          <p className="register-footer">
            Já tem conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>

      <div className="register-image">
        <Image src="/login/background.jpg" alt="Register background" fill priority />
        <div className="register-image-overlay" />
      </div>
    </div>
  );
}
