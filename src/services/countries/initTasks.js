// src/services/countries/initTasks.js
import { refreshCountries } from "./refreshService.js";
// import { initDb } from "./initDb.js"; // optional, if you want to run DB init here

export async function runInitTasks() {
  try {
    // Optional: initialize tables only if needed
    // await initDb();

    // Refresh countries & generate summary in background
    const result = await refreshCountries();
    console.log("Countries refreshed:", result);
  } catch (err) {
    console.error("Init task error:", err);
  }
}
