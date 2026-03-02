import bcrypt from 'bcryptjs';
import { createHash, randomUUID } from 'node:crypto';
import { and, eq, gt, isNull } from 'drizzle-orm';

import type { AuthRepository } from '~/core/auth/auth.port';
import type { User, UserRole } from '~/core/auth/auth.types';
import { db } from '~/infra/db/client.sqlite';
import { emailVerificationTokens, sessions, users } from '~/infra/db/schema';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;

function toUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    phone: row.phone,
    timezone: row.timezone,
    about: row.about,
    emailVerifiedAt: row.emailVerifiedAt,
    role: row.role as UserRole,
    createdAt: row.createdAt,
  };
}

function hashVerificationToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createSqliteAuthRepository(): AuthRepository {
  return {
    async register({ displayName, email, password, phone, timezone }) {
      const existing = await db.select().from(users).where(eq(users.email, email)).get();
      if (existing) throw new Error('EMAIL_TAKEN');

      const id = randomUUID();
      const passwordHash = await bcrypt.hash(password, 10);

      await db
        .insert(users)
        .values({
          id,
          displayName,
          email,
          phone: phone ?? null,
          timezone: timezone ?? null,
          about: null,
          emailVerifiedAt: null,
          passwordHash,
        })
        .run();

      const row = await db.select().from(users).where(eq(users.id, id)).get();
      if (!row) throw new Error('USER_CREATE_FAILED');
      return toUser(row);
    },

    async login({ email, password }) {
      const row = await db.select().from(users).where(eq(users.email, email)).get();
      if (!row) throw new Error('INVALID_CREDENTIALS');
      if (!row.emailVerifiedAt) throw new Error('EMAIL_NOT_VERIFIED');

      const ok = await bcrypt.compare(password, row.passwordHash);
      if (!ok) throw new Error('INVALID_CREDENTIALS');

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

    async updateDisplayName({ userId, displayName }) {
      await db.update(users).set({ displayName }).where(eq(users.id, userId)).run();

      const row = await db.select().from(users).where(eq(users.id, userId)).get();
      if (!row) throw new Error('USER_NOT_FOUND');
      return toUser(row);
    },

    async updateProfile({ userId, displayName, phone, about }) {
      await db.update(users).set({ displayName, phone, about }).where(eq(users.id, userId)).run();

      const row = await db.select().from(users).where(eq(users.id, userId)).get();
      if (!row) throw new Error('USER_NOT_FOUND');
      return toUser(row);
    },

    async changePassword({ userId, currentPassword, newPassword }) {
      const row = await db.select().from(users).where(eq(users.id, userId)).get();
      if (!row) throw new Error('USER_NOT_FOUND');

      const ok = await bcrypt.compare(currentPassword, row.passwordHash);
      if (!ok) throw new Error('INVALID_CREDENTIALS');

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await db.update(users).set({ passwordHash }).where(eq(users.id, userId)).run();
    },

    async createEmailVerificationToken({ userId }) {
      const token = randomUUID();
      const tokenHash = hashVerificationToken(token);
      const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

      await db
        .insert(emailVerificationTokens)
        .values({
          id: randomUUID(),
          userId,
          tokenHash,
          expiresAt,
          usedAt: null,
        })
        .run();

      return { token, expiresAt };
    },

    async verifyEmailToken({ token }) {
      const tokenHash = hashVerificationToken(token);
      const now = new Date();

      const record = await db
        .select()
        .from(emailVerificationTokens)
        .where(
          and(eq(emailVerificationTokens.tokenHash, tokenHash), isNull(emailVerificationTokens.usedAt)),
        )
        .get();

      if (!record) throw new Error('EMAIL_TOKEN_INVALID');
      if (record.expiresAt <= now) throw new Error('EMAIL_TOKEN_EXPIRED');

      await db
        .update(emailVerificationTokens)
        .set({ usedAt: now })
        .where(eq(emailVerificationTokens.id, record.id))
        .run();

      await db.update(users).set({ emailVerifiedAt: now }).where(eq(users.id, record.userId)).run();
    },
  };
}
