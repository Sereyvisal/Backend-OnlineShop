import express from "express";
import * as Role from "../controllers/RoleController.js"

const routers = express.Router();

routers.post("/list", (req, res) => Role.listRole(req, res));

routers.get("/:id", (req, res) => Role.getRole(req, res));

routers.post("/upsert", (req, res) => Role.upsertRole(req, res));

routers.delete("/delete/:id", (req, res) => Role.deleteRole(req, res));

export default routers;