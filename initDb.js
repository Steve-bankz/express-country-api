// initDb.js
import fs from "fs";
import pool from "./db.js";

async function initDB() {
  try {
    const sql = fs.readFileSync("./init.sql", "utf-8");
    const statements = sql.split(";").filter(s => s.trim().length);

    for (const stmt of statements) {
      await pool.query(stmt);
    }

    console.log("Database initialized successfully!");
    process.exit(0); // Stop script
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
}

initDB();
