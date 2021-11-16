import express from "express";
import * as Cart from "../controllers/CartController.js"

const routers = express.Router();

routers.post("/list", (req, res) => Cart.listCart(req, res));

// routers.get("/:id", (req, res) => Cart.getCart(req, res));

routers.get("/customer/:id", (req, res) => Cart.getCartByCustomerId(req, res));

routers.post("/upsert", (req, res) => Cart.upsertCart(req, res));

routers.post("/updatecartqty", (req, res) => Cart.updateCartQty(req, res));

routers.delete("/delete/:id", (req, res) => Cart.deleteCart(req, res));

export default routers;