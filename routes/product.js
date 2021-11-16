import express from "express";
import * as Product from "../controllers/ProductController.js";

const router = express.Router();

router.post("/list", Product.listProduct);

router.get("/:id", Product.getProduct);

router.post("/upsert", Product.upsertProduct);

router.delete("/delete/:id", Product.deleteProduct);

export default router;