import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import  { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
 

// give some route to check user login 


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


// 2nd route for login karne ke liye, login karne ke liye bhi hum ek alag route banayenge jiska naam hoga /login aur usme bhi post request aayegi aur uske corresponding controller method ko call karenge, jiska naam hoga loginUser, to is route ko bhi define kar dete hai
router.route("/login").post(loginUser)



// secured routes
router.route("/logout").post(verifyJWT, logoutUser)  // logout karne ke liye bhi ek alag route banayenge jiska naam hoga /logout aur usme bhi post request aayegi aur uske corresponding controller method ko call karenge, jiska naam hoga logoutUser, to is route ko bhi define kar dete hai, aur is route ko secure karne ke liye hum verifyJWT middleware ka use karenge taki sirf authenticated users hi logout kar sake


export default router;