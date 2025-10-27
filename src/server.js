// src/server.js
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server immediately without blocking
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: you can still refresh countries asynchronously
// via a separate cron job or API endpoint instead of blocking startup

