import express from "express";
import * as Order from "../controllers/OrderController.js"

const routers = express.Router();

routers.post("/list", (req, res) => Order.listOrder(req, res));

routers.get("/:id", (req, res) => Order.getOrder(req, res));

routers.get("/customer/:id", (req, res) => Order.getOrderByCustomerId(req, res));

routers.post("/upsert", (req, res) => Order.upsertOrder(req, res));

routers.post("/updatestatus", (req, res) => Order.updateStatus(req, res));

routers.delete("/delete/:id", (req, res) => Order.deleteOrder(req, res));

export default routers;