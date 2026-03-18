import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router() // vaise hi router banate hai jese ki express ki app banate hai 

router.route("/register").post(registerUser)
// router.route("/login").post(registerUser)


export default router;