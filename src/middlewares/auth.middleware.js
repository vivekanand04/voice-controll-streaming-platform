// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { newUser } from "../models/account.model.js";

// export const verifyJWT = asyncHandler(async(req , _ , next) => {
//   console.log("✅ verifyJWT middleware hit");

//    try {
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")
    
//     if (!token) { 
 
//      throw new ApiError(401 , "Unauthorized request")
     
//     }
 
//    const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
 
//    const user = await  newUser.findById(decodedToken?._id).select
//    ("-password -refreshToken")
 
//    if (!user) {
 
//      throw new ApiError(401 , "Invalid Access Token")
     
//    }
 
//    req.user = user;
//    next()
//    } catch (error) {

//     throw new ApiError(401, error?.message || "Invalid access token")
    
//    }

// })



import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { newUser } from "../models/account.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  console.log("✅ verifyJWT middleware hit");

  try {
    // get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // fetch user (exclude password & refreshToken)
    const user = await newUser
      .findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // attach user to req
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
