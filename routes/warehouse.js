import express from "express";
import { listWarehouse, upsertWarehouse, deleteWarehouse, getWarehouse } from "../controllers/WarehouseController.js"

const routers = express.Router();

routers.post("/list", (req, res) => listWarehouse(req, res));

routers.get("/:id", (req, res) => getWarehouse(req, res));

routers.post("/upsert", (req, res) => upsertWarehouse(req, res));

routers.delete("/delete/:id", (req, res) => deleteWarehouse(req, res));

export default routers;