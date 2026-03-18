// app.use middliware k liye use akrte hai

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express(); 

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


//data ko json format me convert krne k liye
app.use(express.json({limit: "10mb"}));

// urlencoded data ko json format me convert krne k liye
app.use(express.urlencoded({limit: "10mb",extended: true}));

// static files ko serve krne k liye public folder me rakhte hai
app.use(express.static("public"));

// cookies ko parse krne k liye cookie-parser middleware use krte hai
app.use(cookieParser());




//routes import krne hai

import userRouter from "./routes/user.routes.js";

// routes ko use krne ke liye app.use ka use krte hai jisme pehla argument route ka path hota hai aur dusra argument router hota hai, yaha hum userRouter ko /api/v1/users route ke sath use kr rahe hai taki jab bhi koi request /api/v1/users route par aayegi to userRouter ke routes handle karenge, aur uske baad us file ko cloudinary me upload kar sake, aur uske baad us file ko local storage se delete kar sake taki local storage me unnecessary files na rahe
// routes declarariton
app.use("/api/v1/users", userRouter);
// https://localhost:8000/api/v1/users/register 
// yaha par jese hi koi request /api/v1/users/register route par aayegi to userRouter ke routes handle karenge, aur uske baad us file ko cloudinary me upload kar sake, aur uske baad us file ko local storage se delete kar sake taki local storage me unnecessary files na rahe


export { app };