import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { FastifyInstance } from "fastify";

const db = drizzle(process.env.DATABASE_URL!);

export async function testConnection(server: FastifyInstance) {
  try {
    await db.execute(sql`select 1`);
    server.log.info("✅  Database connection successful!");
  } catch (error) {
    server.log.error(
      `Database connection error: ${(error as { code: string }).code}`
    );
    process.exit(1);
  }
}

export default db;
