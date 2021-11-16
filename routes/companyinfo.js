import express from "express";
import * as CompanyInfo from "../controllers/CompanyInfoController.js"

const routers = express.Router();

// routers.post("/list", (req, res) => CompanyInfo.listCompanyInfo(req, res));

routers.get("/", (req, res) => CompanyInfo.getCompanyInfo(req, res));

routers.post("/upsert", (req, res) => CompanyInfo.upsertCompanyInfo(req, res));

// routers.delete("/delete/:id", (req, res) => CompanyInfo.deleteCompanyInfo(req, res));

export default routers;