// app/infra/db/schema.ts
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  ownerUserId: text('owner_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  teamId: text('team_id').references(() => teams.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'),
  status: text('status', { enum: ['active', 'archived'] }).notNull().default('active'),
  imageUrl: text('image_url'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  assigneeId: text("assignee_id").references(() => users.id, { onDelete: "set null" }),
  title: text('title').notNull(),
  description: text('description'),
  labels: text('labels').notNull().default('[]'),
  checklist: text('checklist').notNull().default('[]'),
  dueDate: integer('due_date', { mode: 'timestamp_ms' }),
  status: text('status', { enum: ['todo', 'in-progress', 'qa', 'ready-to-go-live', 'done', 'discarded'] })
    .notNull()
    .default('todo'),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] })
    .notNull()
    .default('medium'),
  orderIndex: integer('order_index').notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
  updatedAt:  integer("updated_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
});

export const taskActivities = sqliteTable('task_activities', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  actorUserId: text('actor_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action', {
    enum: [
      'created',
      'updated',
      'labels-changed',
      'checklist-changed',
      'comment-added',
      'comment-updated',
      'comment-deleted',
      'due-date-changed',
      'status-changed',
      'priority-changed',
      'assignee-changed',
      'reordered',
      'deleted',
    ],
  }).notNull(),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const taskComments = sqliteTable('task_comments', {
  id: text('id').primaryKey(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  authorUserId: text('author_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  phone: text("phone"),
  timezone: text("timezone"),
  about: text("about"),
  emailVerifiedAt: integer("email_verified_at", { mode: "timestamp_ms" }),
	role: text("role", { enum: ["user", "manager", "admin"] })
  .notNull()
  .default("user"),
  passwordHash: text("password_hash").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date()),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  ownerUserId: text('owner_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const teamMembers = sqliteTable(
  'team_members',
  {
    id: text('id').primaryKey(),
    teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    status: text('status', { enum: ['invited', 'accepted', 'rejected'] }).notNull().default('invited'),
    invitedBy: text('invited_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
    respondedAt: integer('responded_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => [uniqueIndex('team_members_team_user_unique').on(t.teamId, t.userId)],
);

export const projectMembers = sqliteTable(
  'project_members',
  {
    id: text('id').primaryKey(),
    projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    role: text('role', { enum: ['viewer', 'member', 'full'] }).notNull().default('member'),
    sidebarOrder: integer('sidebar_order').notNull().default(0),
    pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (t) => [uniqueIndex('project_members_project_user_unique').on(t.projectId, t.userId)],
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
  .notNull()
  .$defaultFn(() => new Date()),
});

export const emailVerificationTokens = sqliteTable(
  "email_verification_tokens",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    usedAt: integer("used_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("email_verification_tokens_hash_unique").on(t.tokenHash)],
);

export const featureFlags = sqliteTable(
  "feature_flags",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    key: text("key").notNull(),
    description: text("description"),
    // tipo de flag: boolean simple o percentage rollout
    type: text("type", { enum: ["boolean", "percentage"] }).notNull().default("boolean"),
    enabledDevelopment: integer("enabled_development", { mode: "boolean" }).notNull().default(false),
    enabledProduction: integer("enabled_production", { mode: "boolean" }).notNull().default(false),
    rolloutPercentDevelopment: integer("rollout_percent_development"),
    rolloutPercentProduction: integer("rollout_percent_production"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
    updatedAt:  integer("updated_at", { mode: "timestamp_ms" })
  	.notNull()
  	.$defaultFn(() => new Date()),
  },
  (t) => [uniqueIndex("feature_flags_key_unique").on(t.key)]
);
