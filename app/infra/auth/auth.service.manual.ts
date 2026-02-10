import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";

import type { AuthService } from "~/core/auth/auth.port";
import type { User } from "~/core/auth/auth.types";
import { db } from "~/infra/db/client.sqlite"; // ajustá si tu client se llama distinto
import { sessions, users } from "~/infra/db/schema";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function toUser(row: typeof users.$inferSelect): User {
  return { id: row.id, email: row.email, createdAt: row.createdAt };
}

export function createManualAuthService(): AuthService {
  return {
    async register({ email, password }) {
      const existing = await db.select().from(users).where(eq(users.email, email)).get();
      if (existing) throw new Error("EMAIL_TAKEN");

      const id = randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);

      await db.insert(users).values({ id, email, passwordHash }).run();

      const row = await db.select().from(users).where(eq(users.id, id)).get();
      if (!row) throw new Error("USER_CREATE_FAILED");
      return toUser(row);
    },

    async login({ email, password }) {
      const row = await db.select().from(users).where(eq(users.email, email)).get();
      if (!row) throw new Error("INVALID_CREDENTIALS");

      const ok = await bcrypt.compare(password, row.passwordHash);
      if (!ok) throw new Error("INVALID_CREDENTIALS");

      const sessionId = randomUUID();
			const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await db.insert(sessions).values({ id: sessionId, userId: row.id, expiresAt }).run();

      return { user: toUser(row), sessionId };
    },

    async logout(sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId)).run();
    },

    async getUserBySession(sessionId) {
			const now = new Date();

      const sess = await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))
        .get();

      if (!sess) return null;

      const row = await db.select().from(users).where(eq(users.id, sess.userId)).get();
      return row ? toUser(row) : null;
    },
  };
}
