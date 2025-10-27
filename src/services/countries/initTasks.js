// src/services/countries/initTasks.js
import { refreshCountries } from "./refreshService.js";

export function runInitTasks() {
  // Run async task without awaiting — fires in background
  setImmediate(async () => {
    try {
      const result = await refreshCountries();
      console.log("✅ Countries refreshed:", result);
    } catch (err) {
      console.error("❌ Init task error:", err);
    }
  });
}
