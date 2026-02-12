// app/infra/db/schema.ts
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { enum: ['todo', 'in-progress', 'done'] })
    .notNull()
    .default('todo'),
  priority: text('priority', { enum: ['low', 'medium', 'high'] })
    .notNull()
    .default('medium'),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
  updatedAt:  integer("updated_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
	role: text("role", { enum: ["user", "admin"] })
  .notNull()
  .default("user"),
  passwordHash: text("password_hash").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date()),
});

export const featureFlags = sqliteTable(
  "feature_flags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    key: text("key").notNull(),
    description: text("description"),
    environment: text("environment").notNull().default("development"),
    // tipo de flag: boolean simple o percentage rollout
    type: text("type", { enum: ["boolean", "percentage"] }).notNull().default("boolean"),
    enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
    rolloutPercent: integer("rollout_percent"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
    updatedAt:  integer("updated_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("feature_flags_key_env_unique").on(t.key, t.environment)]
);
