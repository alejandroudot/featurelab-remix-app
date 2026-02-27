export type User = {
  id: string;
  email: string;
  displayName: string | null;
  role: "user" | "admin";
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
