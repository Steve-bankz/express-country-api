// src/server.js
import app from "./app.js";
import dotenv from "dotenv";
import { runInitTasks } from "./services/countries/initTasks.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// ✅ Start the server first so it’s instantly responsive
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// ✅ Run background initialization safely without blocking
(async () => {
  try {
    console.log("⏳ Starting background initialization...");
    
    // Run without blocking the main thread
    setImmediate(async () => {
      try {
        await runInitTasks(); // refreshes countries, generates image, updates DB
        console.log("✅ Initialization tasks completed successfully.");
      } catch (error) {
        console.error("❌ Error in initialization tasks:", error.message);
      }
    });
  } catch (error) {
    console.error("❌ Failed to start initialization tasks:", error.message);
  }
})();
