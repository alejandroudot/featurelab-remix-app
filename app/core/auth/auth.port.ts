import type { User } from "./auth.types";

export type LoginInput = { email: string; password: string };

export type RegisterInput = {
  displayName: string;
  email: string;
  password: string;
  phone?: string;
  timezone?: string;
};

export type UpdateDisplayNameInput = { userId: string; displayName: string };

export type UpdateProfileInput = {
  userId: string;
  displayName: string;
  phone: string | null;
  about: string | null;
};

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

export type CreateEmailVerificationTokenInput = {
  userId: string;
};

export type VerifyEmailTokenInput = {
  token: string;
};

export interface AuthRepository {
  register(input: RegisterInput): Promise<User>;
  login(input: LoginInput): Promise<{ user: User; sessionId: string }>;
  logout(sessionId: string): Promise<void>;
  getUserBySession(sessionId: string): Promise<User | null>;
  updateDisplayName(input: UpdateDisplayNameInput): Promise<User>;
  updateProfile(input: UpdateProfileInput): Promise<User>;
  changePassword(input: ChangePasswordInput): Promise<void>;
  createEmailVerificationToken(
    input: CreateEmailVerificationTokenInput,
  ): Promise<{ token: string; expiresAt: Date }>;
  verifyEmailToken(input: VerifyEmailTokenInput): Promise<void>;
}
