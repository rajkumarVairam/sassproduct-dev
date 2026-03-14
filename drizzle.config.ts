import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js and doesn't load .env.local automatically.
// This ensures DATABASE_URL is available for all drizzle-kit commands.
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/auth-schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
