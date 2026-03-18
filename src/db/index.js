import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// async await used because database is in another continent and
// we have to wait for connection to be established before starting server
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );

    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}\n`);
  } catch (error) {
    console.log("MOONGO DB CONNECTION ERROR:", error);
    process.exit(1);
  }
};

export default connectDB;