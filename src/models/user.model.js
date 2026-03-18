import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema(
    {
        usernam: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true  //for seraching in database we used index=true
        },
        email: {
            type: String,
            required: true, 
            unique: true,
            lowercase: true,
            trim: true,
    },
        fullName:{
            type: String,
            required: true,
            unique: true,
            // lowercase: true,
            trim: true,
        },
        avtar:{
            type: String, //cloudinary ka url use karege
            required: true,
        },
        coverImage:{
            type: String, //cloudinary ka url use karege
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video",
            }
        ],

        password:{
            type: String,
            required: [true, "Password is required"],
            //  minlength: [6, "Password must be at least 6 characters long"],
            //  select: false, //jab bhi user ko fetch karege to password nahi aayega
        },
        refreshToken:{
            type: String,

        }
    },
    {
        timestamps: true,
    }

)


//pre hook ka use krke password ko hash krna hai jab bhi user ka password save ho ya update ho taki database me password plain text me na rahe aur security badh jaye
// next ka mtalab hai ki tum ise aage badhne do taki ye function complete ho jaye aur next middleware me ja sake
userSchema.pre("save", async function(next) {  // async or await isliye use krte hai taki password ko hash krne me time lagta hai aur hum chahte hai ki jab tak password hash na ho jaye tab tak user ko response na bheje
     if(!this.isModified("password")) return next();
    
     this.password = bcrypt.hashSync(this.password, 10);  // is line ka matlab hai ki password ko hash krna hai aur 10 rounds of salt use krna hai taki password ko crack karna mushkil ho jaye
     next(); // iska means hai ki ye function complete ho gaya hai aur next middleware me ja sakta hai, yaha jab bhi data sav hoga to ye function call hoga aur password ko hash krke database me save karega

    })
//bcrypt se password ko hash krna hai taki database me password plain text me na rahe aur security badh jaye



// custom ethod design
userSchema.methods.isPasswordCorrect =  async function(password){
    return await bcrypt.compareSync(password, this.password); // is line ka matlab hai ki password ko compare krna hai jo user ne input kiya hai aur jo database me save hai, agar dono match karte hai to true return karega warna false return karega
}

// hwt ek weaer toekn hai iska matlab hai ki user ko authenticate karne ke liye ek token generate karna hai taki user authentication me use kr sake aur token ke through user ko identify kr sake

// jsonwebtoken se user ko token generate krna hai taki user authentication me use kr sake aur token ke through user ko identify kr sake
userSchema.methods.generateAccessToken = function(){
   return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// refresh token bhi generate krna hai taki user ko baar baar login na karna pade aur refresh token ke through access token ko refresh kar sake
userSchema.methods.generateRefreshToken = function(){
      return  jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User", userSchema);

//bcrypt se password ko hash krna hai taki database me password plain text me na rahe aur security badh jaye
//jsonwebtoken se user ko token generate krna hai taki user authentication me use kr sake aur token ke through user ko identify kr sake
//  iski website bhi hai jwt.io jaha se token generate krna aur verify krna dono kar sakte hai