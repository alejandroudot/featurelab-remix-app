// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'sqlite', // importante
  schema: './app/infra/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    // para sqlite local
    url: process.env.SQLITE_DB_PATH ?? './featurelab.db', // o 'featurelab.db' a secas, ambas valen para local
  },
});
