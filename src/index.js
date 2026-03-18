//  require("dotenv").config({path: "./.env"});

import dotenv from "dotenv";

// import mongoose, { connection } from "mongoose";
// import { DB_NAME } from "./constants.js";   
import connectDB from "./db/index.js";


dotenv.config({ 
    path: "./.env"
 });

connectDB()
  .then(() => {
    // app.listemn se pahle error k liye bhi listrn karna chathe hai
    // app.on("error", (error) => {
    //   console.error("Error:", error);
    //   throw error;
    // });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });

/* type -1 database connection and server setup
import express from "express";

const app = express();

( async () => {
    try {
        await mongoose.connect( `${ process.env.MONGODB_URI }/${ DB_NAME }` );
        app.on( "error", ( error ) => {
            console.error( "Error:", error );
            throw error
        } );
       
        app.listen( process.env.PORT, () => {
            console.log( `App is listining on port ${ process.env.PORT }` );
        } );

    } catch ( error ) {
        
        console.error( "Error:", error );
        throw error;
    }
} )();
 */