
// src/server.js
import app from "./app.js";
import { runInitTasks } from "./services/countries/initTasks.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

// 1️⃣ Start server immediately
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 2️⃣ Run initialization tasks asynchronously
runInitTasks(); // this will call refreshCountries and generate the summary image
