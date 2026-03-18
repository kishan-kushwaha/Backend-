// middileware ka matlab kahi bhi jao to mere se milkar jaana hi hai, jaise ki jab bhi koi request aayegi to sabse pehle ye middleware chalega aur uske baad hi route handler chalega, isliye is middleware me hum multer ka use karenge taki hum file upload kar sake, multer ek npm package hai jo ki file upload karne ke liye use hota hai, is middleware me hum multer ko configure karenge taki hum file upload kar sake
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {  
    // file multer ke through upload hoti hai to pehle ye function call hota hai jisme req user request hoti hai and file wo file hoti hai jo user upload kar raha hai, cb ka matlab callback function hota hai jisme pehla argument error hota hai aur dusra argument destination path hota hai jaha file ko save karna hai, yaha hum file ko public folder ke andar temp folder me save kar rahe hai taki hum uske baad us file ko cloudinary me upload kar sake, aur uske baad us file ko local storage se delete kar sake taki local storage me unnecessary files na rahe
    //yaha req user request hoti hai and file wo file hoti hai jo user upload kar raha hai, cb ka matlab callback function hota hai jisme pehla argument error hota hai aur dusra argument destination path hota hai jaha file ko save karna hai
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname);
    // file.originalname ka matlab hai ki file ka original name kya hai, aur uniqueSuffix ka matlab hai ki file ka name unique hona chahiye taki agar same name ki file upload hoti hai to wo overwrite na ho jaye, isliye hum file ke name ke sath ek unique suffix add kar rahe hai taki file ka name unique ho jaye, aur uske baad us file ko cloudinary me upload kar sake, aur uske baad us file ko local storage se delete kar sake taki local storage me unnecessary files na rahe
    // yaha req user request hoti hai and file wo file hoti hai jo user upload kar raha hai, cb ka matlab callback function hota hai jisme pehla argument error hota hai aur dusra argument file name hota hai jaha file ko save karna hai, yaha hum file ke original name ke sath ek unique suffix add kar rahe hai taki file ka name unique ho jaye, aur uske baad us file ko cloudinary me upload kar sake, aur uske baad us file ko local storage se delete kar sake taki local storage me unnecessary files na rahe
  }
});

const upload = multer({ 
    storage, 
});

export { upload };