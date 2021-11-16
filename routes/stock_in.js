import express from "express";
import { listStockIn, upsertStockIn, deleteStockIn, getStockIn } from "../controllers/StockInController.js"

const routers = express.Router();

routers.post("/list", (req, res) => listStockIn(req, res));

routers.get("/:id", (req, res) => getStockIn(req, res));

routers.post("/upsert", (req, res) => upsertStockIn(req, res));

routers.delete("/delete/:id", (req, res) => deleteStockIn(req, res));

export default routers;