import express from "express";
import * as Attribute from "../controllers/ProductAttrController.js";

const router = express.Router();

router.get("/list", Attribute.listProductAttr);

router.get("/:id", Attribute.getProductAttr);

router.post("/upsert", Attribute.upsertProductAttr);

router.delete("/delete/:id", Attribute.deleteProductAttr);

export default router;