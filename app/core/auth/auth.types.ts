export type User = {
  id: string;
  email: string;
  createdAt: Date;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
