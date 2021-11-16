import express from "express";
import * as category from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/list", category.listCategory);

router.post("/upsert", category.upsertCategory);

router.delete("/delete/:id", category.deleteCategory);

export default router;