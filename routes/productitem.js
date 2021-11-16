import express from "express";
import * as productitem from "../controllers/ProductItemController.js";

const router = express.Router();

router.post("/list", productitem.listProductItem);

router.get("/:id", productitem.getProductItem);

router.get("/product/:id", productitem.getProductItemsByProduct);

router.post("/upsert", productitem.upsertProductItem);

router.delete("/deactivate/:id", productitem.deactivateProductItem);

router.delete("/delete/:id", productitem.deleteProductItem);

router.post("/delete/productitems", productitem.deleteProductItems);

export default router;