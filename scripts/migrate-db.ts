import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Connecting to database...");
    const client = await pool.connect();

    console.log("Reading schema file...");
    const schemaPath = join(process.cwd(), "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    console.log("Executing schema...");
    await client.query(schema);

    console.log("Migration completed successfully!");
    client.release();
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
