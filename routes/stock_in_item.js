import express from "express";
import { listStockInItem, upsertStockInItem, deleteStockInItem, getStockInItem } from "../controllers/StockInItemController.js"

const routers = express.Router();

routers.post("/list", (req, res) => listStockInItem(req, res));

routers.get("/:id", (req, res) => getStockInItem(req, res));

routers.post("/upsert", (req, res) => upsertStockInItem(req, res));

routers.delete("/delete/:id", (req, res) => deleteStockInItem(req, res));

export default routers;