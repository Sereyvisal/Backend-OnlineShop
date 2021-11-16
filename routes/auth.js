import express from "express"
import * as User from "../controllers/UserController.js"

const router = express.Router();

router.post("/login", User.login);

router.post("/register", User.register);

router.post("/register/lite", User.registerLite);

router.post("/isadmin", User.isAdmin)

export default router;