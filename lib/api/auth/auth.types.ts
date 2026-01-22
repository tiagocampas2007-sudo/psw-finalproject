export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterOfficePayload {
  name: string;
  email: string;
  password: string;

  officeName: string;
  location: string;
  phone: number;
  openingMinutes: number;
  closingMinutes: number;
}

export interface RegisterOfficeResponse {
  message: string;
  user: AuthUser;
}