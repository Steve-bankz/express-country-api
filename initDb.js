// initDb.js
import fs from "fs";
import pool from "./src/db.js";

async function initDB() {
  try {
    const sql = fs.readFileSync("./init.sql", "utf-8");
    const statements = sql.split(";").filter(s => s.trim().length);

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    // Ensure refresh_meta row exists for tracking last_refreshed_at
    const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM refresh_meta WHERE id = 1");
    if (rows[0].cnt === 0) {
      await pool.query(
        "INSERT INTO refresh_meta (id, last_refreshed_at) VALUES (1, NOW())"
      );
    }

    console.log("Database initialized successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

initDB();

