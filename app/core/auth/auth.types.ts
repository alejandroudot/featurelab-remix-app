export type UserRole = 'user' | 'manager' | 'admin';

export type User = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  timezone: string | null;
  about: string | null;
  emailVerifiedAt: Date | null;
  role: UserRole;
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
