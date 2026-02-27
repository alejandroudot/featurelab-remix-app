export type User = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  timezone: string | null;
  about: string | null;
  role: "user" | "admin";
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
