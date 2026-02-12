// app/infra/db/client.sqlite.ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

const dbPath = process.env.SQLITE_DB_PATH ?? './featurelab.db'; // mismo nombre que en drizzle.config.ts

const sqlite = new Database(dbPath);

export const db = drizzle(sqlite, { schema });
