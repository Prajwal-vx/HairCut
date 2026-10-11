import { apiClient } from "./apiClient";
import type { AuthSessionUser } from "@/types";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  gender?: string;
  preferredChannel?: string;
  referralCodeInput?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthSessionUser;
  error?: string;
}

export const authService = {
  async getMe(): Promise<{ user: AuthSessionUser | null }> {
    return apiClient.get<{ user: AuthSessionUser | null }>("/api/auth/me");
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", credentials);
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/register", data);
  },

  async logout(): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>("/api/auth/logout");
  },
};
