import express from "express";
import * as Inventory from "../controllers/InventoryController.js"

const routers = express.Router();

routers.post("/list", (req, res) => Inventory.listInventory(req, res));

routers.get("/:id", (req, res) => Inventory.getInventory(req, res));

routers.get("/product/:id", (req, res) => Inventory.getInventoryByProductId(req, res));

// routers.get("/:id&:warehouse", (req, res) => Inventory.getInventoryByProductAndWarehouse(req, res));

routers.post("/upsert", (req, res) => Inventory.upsertInventory(req, res));

routers.delete("/delete/:id", (req, res) => Inventory.deleteInventory(req, res));

export default routers;