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

export { app };