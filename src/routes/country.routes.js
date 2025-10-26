// src/routes/country.routes.js
import express from "express";
import * as ctrl from "../controllers/country.controller.js";

const router = express.Router();

// Refresh (main heavy job)
router.post("/refresh", ctrl.postRefresh);

// Serve generated image
router.get("/image", ctrl.getSummaryImage);

// CRUD
router.get("/", ctrl.getAllCountries);
router.get("/:name", ctrl.getCountryByName);
router.post("/", ctrl.createCountry);
router.put("/:id", ctrl.updateCountry);
router.delete("/:name", ctrl.deleteCountryByName);



export default router;
