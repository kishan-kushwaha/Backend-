import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
//    user register k liye logic k steps
   
    //  get user details from frontend
    // validation --v not empty, email format, password strength
    // check if user already exists with the same email : check username, email
    // check for images, check for avtar
    // upload them cloudinary and get the url of the uploaded image, check avtar on cloudinary
    // create user object - create entry in db
    // remove password and refrresh token field from response
    // checkfor user creation
    // return res 
     

//    step-1 get user details from frontend
// jab dat form yaa json se aata hai to wo body mai mil jaata hai
    const {fullName, username, email, password } = req.body
    console.log("email", email);


    // step-2 validation --v not empty, email format, password strength
    // if(fullName === ""){
    //     throw new ApiError(400, "Full name is required");
    // }

    // 2nd way of checking validation is to use array and some method taki agar koi bhi field empty ho to error throw kar sake, aur isme humne trim method ka use kiya hai taki agar user ne space de diya ho to usko bhi empty consider kiya ja sake
    if(
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required");
    }



    // step-3 check if user already exists with the same email : check username, email
    const existedUser =  User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }


//   step-4 check for images, check for avtar
      
    console.log("req.files", req.files);
     const avtarLocalPath =   req.files?.avtar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //  console.log("avtarLocalPath", avtarLocalPath);
    //  console.log("coverImageLocalPath", coverImageLocalPath);

    //check for avtar
    if(!avtarLocalPath){
        throw new ApiError(400, "Avtar is required");
    }

    // step-5 upload them cloudinary and get the url of the uploaded image, check avtar on cloudinary
    const avtar = await uploadOnCloudinary(avtarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //check avtar on cloudinary
    if (!avtar) {
        throw new ApiError(400, "Avtar file is required");
    }



    // step-6 create user object - create entry in db
      const user = await User.create({
        fullName,
        avtar: avtar.url,
        coverImage: coverImage?.url || "",   // corner case jab user cover image upload na kare to uske liye empty string set kar dege taki database me null value na aaye
         email,
         password,
        username: username.toLowerCase(),
      })

      // step-7 remove password and refrresh token field from response
      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  //select method ka use krke password aur refresh token field ko response se exclude kar dege taki security badh jaye aur sensitive information response me na aaye
      )

    //   step-8 checkfor user creation
      //now check user create or not 
      if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user");
      }

    //   step-9 return res
         return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
            )
});


export {registerUser}