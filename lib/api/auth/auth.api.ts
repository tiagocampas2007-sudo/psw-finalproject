import { apiFetch } from "../client";
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  RegisterOfficePayload,
  RegisterOfficeResponse,
} from "./auth.types";

// Registar cliente
export function registerUser(
  payload: RegisterPayload
): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Registar oficina (cria ADMIN)
export function registerOffice(
  payload: RegisterOfficePayload
): Promise<RegisterOfficeResponse> {
  return apiFetch<RegisterOfficeResponse>("/api/offices/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 🔥 LOGIN CORRIGIDO COM ROLE
export function loginUser(
  payload: LoginPayload
): Promise<LoginResponse & { role: string }> {
  console.log('🔐 Iniciando login:', payload.email);
  
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response: any) => {
    console.log('🔑 Resposta login:', response);
    
    // Salva token
    if (response.token) {
      localStorage.setItem('token', response.token);
      console.log('✅ TOKEN SALVO');
    }
    
    // 🔥 EXTRAI ROLE do user
    const role = response.user?.role || "CLIENT";
    console.log('🔑 ROLE detectado:', role);
    
    return {
      ...response,
      role: role  // ← RETORNA ROLE para frontend!
    } as LoginResponse & { role: string };
  });
}
