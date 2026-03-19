// ye middileware verify karega ki user hai yaa nahi 

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";





// ye middleware verify karega ki user hai yaa nahi, agar user hai to uski details ko req.user me store kar dega taki aage ke controllers me use kar sake, aur agar user nahi hai to error throw kar dega
export const verifyJWT = asyncHandler(async(req, res, next) => { // yaha res ko _ se replace kar sakte hai kyuki hume res ki zarurat nahi hai, aur next ko bhi _ se replace kar sakte hai kyuki hume next ki zarurat nahi hai, lekin hum next ko isliye rakhte hai taki agar user authenticated hai to next() call kar ke aage ke controllers me ja sake
 try {
     const token = req.cookies?.accessToken  || req.headers
     ("Authorization")?.replace("Bearer", "") 
   
   
     if(!token){
       throw new ApiError(401, "Unauthorized request");
     }
   
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
       if(!user){
           //TODO: discuss about frontend
   
         throw new ApiError(401, "Invalid Access Token");
       }
   
   
       req.user = user;
       next();
 } catch (error) {
    throw new ApiError(401, error?.message  ||  "Invalid Access Token");
 }

})