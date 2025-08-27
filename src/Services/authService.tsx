import { apiClient } from "../API/urlApi";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  message: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post("/authentication/login", credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<void> {
    const response = await apiClient.post("/authentication/register", userData);
    return response.data;
  },
};
