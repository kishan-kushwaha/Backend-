import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import  { upload } from "../middlewares/multer.middleware.js";
 
const router = Router() // vaise hi router banate hai jese ki express ki app banate hai 

router.route("/register").post(
    upload.fields([
        { 
            name: "avatar", 
            maxCount: 1
        
        },
        { 
            name: "coverImage",
             maxCount: 1 
        }
    ]),
    registerUser
);
// router.route("/login").post(registerUser)


export default router;