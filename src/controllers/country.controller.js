import { refreshCountries } from "../services/countries/refreshService.js";
import { SUMMARY_IMAGE_PATH } from "../services/countries/generateImage.js";
import pool from "../db.js";

export async function postRefresh(req, res) {
  try {
    const result = await refreshCountries();
    return res.status(200).json({
      status: "success",
      message: "Countries refreshed successfully",
      count: result.count,
      last_refreshed_at: result.last_refreshed_at,
    });
  } catch (err) {
    console.error("Refresh error:", err.message);

    if (err.statusCode === 503) {
      return res.status(503).json({
        error: "External data source unavailable",
        details: err.message,
      });
    }

    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}


export async function getAllCountries(req, res) {
  try {
    const { search, region, sortBy, order } = req.query;

    // Allowed columns to sort by
    const allowedSortColumns = ["name", "population", "estimated_gdp", "currency_code"];
    const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : "name";
    const sortOrder = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Base query and parameters array
    let sql = "SELECT * FROM countries WHERE 1=1";
    const params = [];

    // Add filters safely
    if (region) {
      sql += " AND LOWER(region) = ?";
      params.push(region.toLowerCase());
    }

    if (search) {
      sql += " AND LOWER(name) LIKE ?";
      params.push(`%${search.toLowerCase()}%`);
    }

    // Add sorting
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const [rows] = await pool.query(sql, params);

    return res.json(rows);
  } catch (err) {
    console.error("Error fetching countries:", err);
    res.status(500).json({ error: "internal server error" });
  }
}



export async function getCountryByName(req, res) {
  try {
    const { name } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM countries WHERE LOWER(name) = LOWER(?) LIMIT 1`,
      [name]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "country not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
}


export async function createCountry(req, res) {
  try {
    const { name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url } = req.body;
    const [result] = await pool.query(
      `INSERT INTO countries (name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, last_refreshed_at)
       VALUES (?,?,?,?,?,?,?,?,NOW())`,
      [name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url]
    );
    const [rows] = await pool.query(`SELECT * FROM countries WHERE id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateCountry(req, res) {
  try {
    const id = req.params.id;
    const { name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url } = req.body;
    const [result] = await pool.query(
      `UPDATE countries 
       SET name=?, capital=?, region=?, population=?, currency_code=?, exchange_rate=?, estimated_gdp=?, flag_url=?, last_refreshed_at=NOW()
       WHERE id=?`,
      [name, capital, region, population, currency_code, exchange_rate, estimated_gdp, flag_url, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Not found" });

    const [rows] = await pool.query(`SELECT * FROM countries WHERE id = ?`, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
}

export async function deleteCountryByName(req, res) {
  try {
    const { name } = req.params;

    const [result] = await pool.query(
      `DELETE FROM countries WHERE LOWER(name) = LOWER(?)`,
      [name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "country Not found" });
    }

    res.json({ status: "deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
}


export async function getSummaryImage(req, res) {
  try {
    res.sendFile(SUMMARY_IMAGE_PATH);
  } catch (err) {
    console.error("Image serve error:", err);
    res.status(500).json({ error: "internal server error" });
  }
}

// controller function
// src/controllers/country.controller.js
export async function getStatus(req, res) {
  try {
    const [totalRows] = await pool.query(`SELECT COUNT(*) AS total FROM countries`);
    const totalCountries = totalRows[0].total || 0;

    const [metaRows] = await pool.query(`SELECT last_refreshed_at FROM refresh_meta WHERE id = 1`);
    const lastRefreshedAt = metaRows.length > 0 ? metaRows[0].last_refreshed_at : null;

    res.json({
      total_countries: totalCountries,
      last_refreshed_at: lastRefreshedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch status" });
  }
}



