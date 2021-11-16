import express from "express";
import * as StockOut from "../controllers/StockOutController.js"

const routers = express.Router();

routers.post("/list", (req, res) => StockOut.listStockOut(req, res));

routers.get("/:id", (req, res) => StockOut.getStockOut(req, res));

routers.post("/upsert", (req, res) => StockOut.upsertStockOut(req, res));

routers.delete("/delete/:id", (req, res) => StockOut.deleteStockOut(req, res));

export default routers;