// src/services/countries/dbOperations.js
import pool from "../../db.js";

/**
 * Saves or updates countries in parallel using Promise.all
 * Ensures refresh_meta.last_refreshed_at is always updated
 */
export async function saveCountries(countriesWithGDP) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const now = new Date();

    // Prepare array of promises for all countries
    const promises = countriesWithGDP.map(async (c) => {
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

      // Check if country exists
      const [existing] = await conn.query(
        `SELECT id FROM countries WHERE LOWER(name) = LOWER(?) LIMIT 1`,
        [name]
      );

      if (existing.length > 0) {
        return conn.query(
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
        return conn.query(
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
    });

    // Run all DB operations in parallel
    await Promise.all(promises);

    // Ensure refresh_meta row exists
    const [metaCheck] = await conn.query(
      "SELECT COUNT(*) AS cnt FROM refresh_meta WHERE id = 1"
    );
    if (metaCheck[0].cnt === 0) {
      await conn.query(
        "INSERT INTO refresh_meta (id, last_refreshed_at) VALUES (1, ?)",
        [now]
      );
    } else {
      await conn.query(
        `UPDATE refresh_meta SET last_refreshed_at = ? WHERE id = 1`,
        [now]
      );
    }

    await conn.commit();
    return { count: countriesWithGDP.length, last_refreshed_at: now };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
