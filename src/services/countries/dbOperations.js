// src/services/countries/dbOperations.js
import pool from "../../db.js";

/**
 * Updates or inserts countries in a single transaction.
 * Returns the number of processed countries.
 */
export async function saveCountries(countriesWithGDP) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const now = new Date();

    for (const c of countriesWithGDP) {
      const {
        name,
        capital,
        region,
        population,
        currency_code,
        exchange_rate,
        estimated_gdp,
        flag_url,
      } = c;

      // Check if country exists (case-insensitive)
      const [existing] = await conn.query(
        `SELECT id FROM countries WHERE LOWER(name) = LOWER(?) LIMIT 1`,
        [name]
      );

      if (existing.length > 0) {
        // Update existing country
        await conn.query(
          `UPDATE countries
           SET capital=?, region=?, population=?, currency_code=?,
               exchange_rate=?, estimated_gdp=?, flag_url=?, last_refreshed_at=?
           WHERE id=?`,
          [
            capital,
            region,
            population,
            currency_code,
            exchange_rate,
            estimated_gdp,
            flag_url,
            now,
            existing[0].id,
          ]
        );
      } else {
        // Insert new country
        await conn.query(
          `INSERT INTO countries
           (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            name,
            capital,
            region,
            population,
            currency_code,
            exchange_rate,
            estimated_gdp,
            flag_url,
            now,
          ]
        );
      }
    }

    // Ensure refresh_meta row exists and update last_refreshed_at
    await conn.query(
      `INSERT INTO refresh_meta (id, last_refreshed_at)
       VALUES (1, ?)
       ON DUPLICATE KEY UPDATE last_refreshed_at = ?`,
      [now, now]
    );

    await conn.commit();

    return { count: countriesWithGDP.length, last_refreshed_at: now };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
