import express from "express";
import { listCurrency, upsertCurrency, deleteCurrency, getCurrency } from "../controllers/CurrencyController.js"

const routers = express.Router();

routers.post("/list", (req, res) => listCurrency(req, res));

routers.get("/:id", (req, res) => getCurrency(req, res));

routers.post("/upsert", (req, res) => upsertCurrency(req, res));

routers.delete("/delete/:id", (req, res) => deleteCurrency(req, res));

export default routers;