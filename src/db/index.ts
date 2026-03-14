import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./auth-schema";

// Shared postgres.js client — reused across requests in serverless environments
const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
