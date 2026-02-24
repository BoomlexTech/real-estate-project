import api from './api';
import type { AuthUser } from './auth';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export interface RegisterAgentPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  languages?: string[];
  specialization?: string;
  bio?: string;
}

export async function loginAdmin(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/auth/admin/login', { email, password });
  return data;
}

export async function loginAgent(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/auth/agent/login', { email, password });
  return data;
}

export async function registerAgent(payload: RegisterAgentPayload): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/auth/agent/register', payload);
  return data;
}

export async function getMe(): Promise<{ success: boolean; user: AuthUser }> {
  const { data } = await api.get('/auth/me');
  return data;
}
