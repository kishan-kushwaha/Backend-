import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; //file system ko manage karne ke liye use karte hai

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const uploadOnCloudinary = async (localFilePath) => {
        try{
            if(!localFilePath) return null; // agar file path nahi hai to null return kar do
            //     {
            //     throw new Error("File path is required");
            // }
            // upload file to cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto", // ye line ka matlab hai ki cloudinary ko ye batana hai ki file ka type kya hai, agar ye line nahi likhenge to cloudinary sirf images ko upload karega aur videos ko upload nahi karega, isliye resource_type ko auto karna zaruri hai taki cloudinary file ke type ko automatically detect kar sake aur uske accordingly upload kar sake
            })
            // file has been uploDED SUCCESSFULLY
            console.log("File uploaded successfully on Cloudinary", response.url);
            // fs.unlinkSync(localFilePath); // delete the file from local storage
            return response;
        }
        catch(error){
            fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation gets failed yaa delete the file from local storage
            console.error("Error uploading file to Cloudinary:", error);
            return null;
        }

}




export { uploadOnCloudinary };
