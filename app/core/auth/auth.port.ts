import type { User } from "./auth.types";

export type RegisterInput = { email: string; password: string };
export type LoginInput = { email: string; password: string };

export interface AuthService {
  register(input: RegisterInput): Promise<User>;
  login(input: LoginInput): Promise<{ user: User; sessionId: string }>;
  logout(sessionId: string): Promise<void>;
  getUserBySession(sessionId: string): Promise<User | null>;
}
