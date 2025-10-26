// src/app.js
import express from "express";
import countryRoutes from "./routes/country.routes.js";
import { getStatus } from "./controllers/country.controller.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());


app.use("/countries", countryRoutes);
app.get("/status", getStatus);

app.get("/", (req, res) => res.send("Country API up"));

export default app;
