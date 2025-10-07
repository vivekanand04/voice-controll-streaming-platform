import { newUser } from "../models/account.model.js";
import { Video } from "../models/video.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    console.log("i am running",userId)
    
    try {
          
        const user = await newUser.findById(userId);
        console.log("🔍 user from DB:", user);
        if (!user) {
  throw new ApiError(404, "User not found for token generation");
}
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    console.log("👉 User passed into token generator:", user);
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

// {******------------------------ register user---------------------------******}

// const registerUser = asyncHandler(async (req, res) => {
//     const { name, email, password } = req.body;
//      console.log("Data received in signup:", req.body); 
    
//     if (!name || !email || !password) {
//         throw new ApiError(400, "All fields are required");
//     }

//     const checkUser = await newUser.findOne({
//         $or: [{ name }, { email }]
//     });

//     // if (checkUser) {
//     //     throw new ApiError(409, "User with email or username already exists");
        
//     // }
//         if (checkUser) return res.status(400).json({ message: "User already exists" });

//     const avatar = "https://res.cloudinary.com/drr9bsrar/image/upload/v1716498256/egt2sufg3qzyn1ofws9t.jpg";

//     const user = await newUser.create({
//         name,
//         email,
//         password,
//         avatar
//     });

//     return res.status(201).json(new ApiResponse(200, user, "User created successfully"));
// });

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("📩 Data received in signup:", req.body);

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required");
        }

        const checkUser = await newUser.findOne({
            $or: [{ name }, { email }]
        });

        if (checkUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const avatar = "https://res.cloudinary.com/drr9bsrar/image/upload/v1716498256/egt2sufg3qzyn1ofws9t.jpg";

        const user = await newUser.create({
            name,
            email,
            password,
            avatar
        });

        return res
            .status(201)
            .json(new ApiResponse(200, user, "User created successfully"));
    } catch (error) {
        console.error("❌ Error in registerUser:", error);  // <-- Full error log

        // send detailed error response
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            stack: error.stack   // 👈 includes full error stack for debugging
        });
    }
};















// {*****------------------------ login user---------------------------******}

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
console.log("Login request body:", req.body);

    if (!email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const userfind = await newUser.findOne({ email });

    if (!userfind) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await userfind.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userfind._id);

    const loggedInUser = await newUser.findById(userfind._id).select("-refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
        //  sameSite: 'lax',
        sameSite:'none'
       
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});
// {------------------------ login user---------------------------}

// {**********-------------------logout user-------------------**********}

const logoutUser = asyncHandler(async (req, res) => {
    await newUser.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {} , "User logged out"));
});
// {**********-------------------logout user-------------------**********}


// {**********-------------------refrese  token-------------------**********}

const refreshAccessToken = asyncHandler( async(req , res)=>{

    try {
        // const incomingRefreshToken = Refreq.cookies.refreshToken || req.body.refreshToken;
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request - no refresh token provided");
}

    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            // process.env.JWT_REFRESH_TOKEN_SECRET
             process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await newUser.findById(decodedToken?._id)
    
        if ( !user ) {
    
            throw new ApiError(401 , "Invalid Token")
            
        }
    
        if (incomingRefreshToken !== user?.refreshToken ) {
    
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options ={
            httpOnly: true,
            secure: true
        }
    
        // const {accessToken , newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // return res
        // .status(200)
        // .cookie("accessToken",  accessToken)
        // .cookie("refreshToken",  refreshToken)
        // .json(new ApiResponse(200, {accessToken , refresh: newrefreshToken} , "Refresh token generated"));
        return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new ApiResponse(200, { accessToken, refreshToken }, "Refresh token generated"));

    
    } catch (error) {

        throw new ApiError(401, "Invalid refresh token")
        
    }
} )

// {**********-------------------refrese  token-------------------**********}

// {**********-------------------Update user-------------------**********}

const updateAccount = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    let avatarName;
    if (req.file) {
        const avatarLocalPath = req.file.path; // Path to the uploaded file
        avatarName = await uploadOnCloudinary(avatarLocalPath);
    }

    const updateData = {
        name,
        email,
        password,
    };

    if (avatarName) {
        updateData.avatar = avatarName.url; // Save the avatar path to the database if it exists
    }

    const user = await newUser.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
    );


    return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});
// {-----------------------------Update user-----------------------------}

// {----------------------------Delete user-------------------------------}

const deleteAccount = asyncHandler(async (req, res) => {
    const user = await newUser.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({
        success: true,
        message: "Account deleted successfully"
    });
});
// {----------------------------Delete user-------------------------------}
// {----------------------------User Data By Id-------------------------------}

const getUserById = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    // console.log(userId);

    const user = await newUser.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User data retrieved successfully"));

})

// {----------------------------User Data By Id-------------------------------}

// {----------------------------Watch History---------------------------------}
const GetWatchHistory = asyncHandler(async (req , res) =>{

    const user = await newUser.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "newusers",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        name: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )

})


// {----------------------------Add Watch History---------------------------------}

const addToWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const user = await newUser.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Add the video to the watch history
    if (!user.watchHistory.includes(id)) {
        user.watchHistory.push(id);
        await user.save();
    }

    return res.status(200).json(new ApiResponse(200, user.watchHistory, "Video added to watch history successfully"));
});

export {
    registerUser,
    login,
    updateAccount,
    deleteAccount,
    logoutUser,
    refreshAccessToken,
    getUserById,
    GetWatchHistory,
    addToWatchHistory
};
