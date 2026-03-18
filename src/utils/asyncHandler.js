
// promise based function to handle async errors in express routes isko isliye use krte hai taki har route me try catch block na likhna pade aur error handling ek jagah se ho jaye
// ye new syntax hai jo express ke routes me use krte hai taki async function ke errors ko catch krke next middleware me bhej sake
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err));
    }
}

export {asyncHandler}



// 3 steps to write asyncHandler
// 1. const asyncHandler = () => {}
// 2. const asyncHandler = (fn) =>  () => {}
// 3. const asyncHandler = (fn) => async() => {}


// try catch block ke andar async function ko call krna hai aur error ko catch krke response me bhejna hai
// const asyncHandler = (fn) => async(req, res, next) => {
//     try{
//         await fn(req, res, next);
//     } catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         })
//     }
// }