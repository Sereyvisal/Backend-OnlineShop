import express from "express";
import * as User from "../controllers/UserController.js"

//Post Routes
const router = express.Router();
//Create 
// router.post("/", User.register);

//Read
router.post("/list", User.listUser);

//List Customer
router.post("/customer/list", User.listCustomer);

//User Info
router.get("/info", User.getUserInfo);

//Reset Password
router.post("/resetpwd", User.resetPwd);

//Update
router.put("/", User.updateUser);

//Get Sepcific based on ID
router.get("/:id", User.getUser);

//Delete 
// router.delete("/:id", deleteUser);

//export all route functions
export default router;