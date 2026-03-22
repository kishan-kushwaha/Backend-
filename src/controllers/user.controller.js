import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
// import { useReducer } from "react";


// seperate method for generating access token and refresh token taki code me reusability badh jaye aur code clean ho jaye, aur agar future me token generate karne ka logic change karna pade to sirf is method me change karna padega aur jaha bhi is method ko call kiya hai waha automatically change reflect ho jayega
const generateAccessAndRefreshTokens =  async(userId) =>{
       //internal method hai isliye asyncHandler ki jarurat nahi hai 
    try{ 
        const user = await User.findById(userId);
       const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken; // refresh token ko user ke document me save karna hai taki jab bhi user access token ko refresh karna chahe to hum refresh token ko verify kar sake aur uske basis pe access token ko refresh kar sake
        await user.save({ validateBeforeSave: false }); // user document ko save karna hai taki refresh token database me save ho jaye
       
        return { accessToken, refreshToken };
    
    }catch(error ){
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }



}



// user register karne ke liye controller method, is method me hum user registration ka sara logic likhenge, taki jab bhi user registration ka request aaye to ye method call ho aur user ko register kar de
const registerUser = asyncHandler(async (req, res) => {
//    user register k liye logic k steps
   
    //  get user details from frontend
    // validation --v not empty, email format, password strength
    // check if user already exists with the same email : check username, email
    // check for images, check for avatar
    // upload them cloudinary and get the url of the uploaded image, check avatar on cloudinary
    // create user object - create entry in db
    // remove password and refrresh token field from response
    // checkfor user creation
    // return res 
     

//    step-1 get user details from frontend
// jab dat form yaa json se aata hai to wo body mai mil jaata hai
    const {fullName, username, email, password } = req.body
    // // console.log("email", email);


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
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists");
    }


//   step-4 check for images, check for avatar
      
    console.log("req.files", req.files);
     const avatarLocalPath =   req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //  console.log("avatarLocalPath", avatarLocalPath);
    //  console.log("coverImageLocalPath", coverImageLocalPath); 

    //check for avatar
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required");
    }

    // classic method to check for cover image
    // let coverImageLocalPath;
    // if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }


    // step-5 upload them cloudinary and get the url of the uploaded image, check avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //check avatar on cloudinary
    if (!avatar) {
        throw new ApiError(400, "avatar file is required");
    }



    // step-6 create user object - create entry in db
      const user = await User.create({
        fullName,
        avatar: avatar?.secure_url || avatar?.url,
        coverImage: coverImage?.secure_url || coverImage?.url || "",   // corner case jab user cover image upload na kare to uske liye empty string set kar dege taki database me null value na aaye
         email,
         password,
        username: username?.toLowerCase(),
      })

      console.log("username:", username);
console.log("avatar object:", avatar);
console.log("coverImage object:", coverImage);

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



// login user
const loginUser = asyncHandler(async (req, res) => {
    // login k liye logic k steps
    // step-1  req body se data le aao req body -> data
    // step -2  username or email se data le aao database se
    // step - 3 find the user in database using email or username
    //step -4 if user the n password check if wrong throw error 
    // step-5 if correct then generate access token and refresh token
    //step -6 send cookies and response to frontend

    // step-1  req body se data le aao req body -> data
    const { email, username , password} = req.body;

    // step -2  username or email se data le aao database se, matlab user ko login karwao to user email yaa username me se koi bhi de sakta hai, to hum dono me se kisi bhi field ko use kar ke user ko find kar sakte hai database me
    if(!username && !email){
        throw new ApiError(400, "username or email is required");
    }

    // step - 3 find the user in database using email or username
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    // step-4 agar user nahi mila to error throw kar do
    if(!user)
    {
        throw new ApiError(404, "User does not exist, please register first");
    }

    //step -5 agar user mil gay to paheckr do ki password sahi hai yaa nahi, iske liye humne user model me ek custom method banaya hai jiska naam hai isPasswordCorrect, to usko call kar ke password check karenge
     const isPasswordValid = await user.isPasswordCorrect(password); // is line ka matlab hai ki user model me jo password hai usko compare karna hai jo user ne input kiya hai, agar dono match karte hai to true return karega warna false return karega

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials, please try again");
    }

    // step-6 agar password sahi hai to access token aur refresh token generate kar do, iske liye humne ek separate method banaya hai jiska naam hai generateAccessAndRefreshTokens, to usko call kar ke access token aur refresh token generate karenge
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

     //ek or dtaatabse query maar dete hai database se data le aao taki access token aur refresh token ke sath user ki details bhi bhej sako response me, aur password aur refresh token field ko response se exclude kar do taki security badh jaye aur sensitive information response me na aaye
     // optional step hai agar hum access token aur refresh token generate karne ke baad user ki details ko response me bhejna chahte hai to is step ko kar sakte hai, agar nahi bhejna chahte to is step ko skip kar sakte hai
     const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken");

  // step-7 send cookies and response to frontend, access token ko hum response me bhejenge taki frontend usko local storage me save kar sake aur refresh token ko http only cookie me bhejenge taki security badh jaye aur refresh token client side se accessible na ho
   const options = {
    httpOnly: true, // isse refresh token client side se accessible nahi hoga, security badh jayegi
    secure:true, // isse refresh token sirf https me hi send hoga, security badh jayegi
   }


   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken, refreshToken

            },
            "User logged In successfully"
            
        )
    )






})


// logout user, iska logic ye hoga ki jab user logout karega to hum uske refresh token ko database se remove kar denge taki agar kisi ke paas refresh token hai bhi to wo use karke access token ko refresh nahi kar paega aur user ko logout karne ke baad access token ki validity khatam ho jayegi, aur refresh token bhi invalid ho jayega
const logoutUser = asyncHandler(async (req, res) => {
    // step-1 user ko database me find karo, iske liye hum user id ko use karenge jo ki access token me hota hai, to access token ko verify kar ke user id nikalenge aur usko use kar ke user ko database me find karenge
    // ham middileware use karege jiska kaam hai jab bhi jao mujse milakr jao to access token ko verify kar ke user ki details nikal do, to jab bhi user logout karega to wo middleware se hoke jayega aur waha se user ki details mil jayegi, to waha se user id nikal ke use karenge
   // const userId = req.user._id; // req.user me user ki details hoti hai jo ki access token ko verify kar ke milti hai, to waha se user id nikal ke use karenge


   await  User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined, // refresh token ko undefined set kar denge taki wo database me save ho jaye aur user ke document me refresh token remove ho jaye
            }
        },
        {
            new: true
        }
    )


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User logged out successfully"))


})



const refreshAccessToken = asyncHandler(async (req, res) => {
    // step-1 refresh token ko cookie se le aao
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

    // step-2 refresh token ko verify karo
    if(incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token");   
        }
    
        if( incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used");
        }
    
        // step-3 agar refresh token valid hai to naya access token generate karo
      const options = {
        httpOnly: true,
        secure: true
      }
    
      const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    
    
        // step-4 naya access token response me bhejo   
        return  res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}