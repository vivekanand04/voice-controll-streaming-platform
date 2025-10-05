import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";


import mongoose from "mongoose";


// ********------------------video upload-------------------********

const publishAVideo = asyncHandler(async (req, res) => {
  console.log("this is publish  video AbortController",req.body)
  const { title, description } = req.body;
  const thumbnailFile = req.files?.thumbnail?.[0];
  const videoFile = req.files?.videoFile?.[0];

  console.log("Files received:", req.files);
console.log("Thumbnail path:", req.files?.thumbnail?.[0]?.path);  
console.log("Video path:", req.files?.videoFile?.[0]?.path);


  if (!title || !description || !thumbnailFile || !videoFile) {
    throw new ApiError(400, "All fields are required, including thumbnail and video files");
  }

  const thumbnailFilePath = await uploadOnCloudinary(thumbnailFile.path);
  const videoFilePath = await uploadOnCloudinary(videoFile.path);

  if (!thumbnailFilePath || !videoFilePath) {
    throw new ApiError(400, "File upload problem");
  }

  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailFilePath.url,
    videoFile: videoFilePath.url,
    owner: req.user._id,
    views: 0 // Initialize views to 0
  });

  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

// ********------------------all video find-------------------********

const getAllVideos = asyncHandler(async (req, res) => {
  // const videos = await Video.find(); // Fetch all videos from the Video collection
const videos = await Video.find()
  .populate('owner', 'name avatar') // only bring username from owner
  .lean();

  return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

// ********------------------ User video find-------------------********

const getAllUserVideos = asyncHandler(async (req, res) => {
  const { owner } = req.params; // Extract the owner ID from the request parameters

  if (!owner) {
    throw new ApiError(400, "Owner ID is required");
  }

  const userVideos = await Video.find({ owner }); // Fetch all videos that match the owner's ID

  if (!userVideos.length) {
    return res.status(404).json(new ApiResponse(404, null, "No videos found for this user"));
  }

  return res.status(200).json(new ApiResponse(200, userVideos, "User videos fetched successfully"));
});

// ********------------------delete video by id-------------------********

const deleteVideoById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the video ID from the request parameters
  const userId = req.user._id; // Get the ID of the logged-in user

  const video = await Video.findById(id);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Check if the logged-in user is the owner of the video
  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  await Video.findByIdAndDelete(id); // Delete the video from the database

  return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
});

// ********------------------video data by id-------------------********

const VideoDataById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the video ID from the request parameters

  const video = await Video.findById(id); // Find the video by ID

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

//   await video.incrementViews();
  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

// -------------------------views increment---------------------------

const viewsIncrement = asyncHandler(async(req , res)=>{

    const { id } = req.params; // Extract the video ID from the request parameters

    const video = await Video.findById(id); // Find the video by ID
  
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    await video.incrementViews();

    return res.status(200).json(new ApiResponse(200, video, "Video Views Updated"));

})

export {
  publishAVideo,
  getAllVideos,
  getAllUserVideos,
  deleteVideoById,
  VideoDataById,
  viewsIncrement
};









// export const toggleLikeOnVideo = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid video id" });
//     const existing = await Like.findOne({ targetType: "Video", target: id, likedBy: req.user._id });
//     if (existing) {
//       await existing.deleteOne();
//       const video = await Video.findByIdAndUpdate(id, { $inc: { views: 0 } });
//       return res.status(200).json({ liked: false });
//     } else {
//       try {
//         await Like.create({ targetType: "Video", target: id, likedBy: req.user._id });
//       } catch (err) {
//         if (err.code !== 11000) throw err;
//       }
//       return res.status(200).json({ liked: true });
//     }
//   } catch (e) {
//     return res.status(500).json({ error: e.message });
//   }
// };



export const toggleLikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Check if already liked
    const existing = await Like.findOne({
      targetType: "Video",
      target: id,
      likedBy: userId,
    });

    if (existing) {
      await existing.deleteOne();
    } else {
      await Like.create({
        targetType: "Video",
        target: id,
        likedBy: userId,
      });
    }

    const totalLikes = await Like.countDocuments({ targetType: "Video", target: id });

    return res.json({ likes: totalLikes });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};




export const listLikedVideos = async (req, res) => {
  try {
    const queryingUserId = req.user._id;
    const userId = req.query.userId || queryingUserId; // allow admin use-case
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "10", 10)));
    const skip = (page - 1) * limit;

    // Fetch likes, populate target (Video) and its owner
    const likes = await Like.find({ likedBy: userId, targetType: "Video" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "target",
        model: "Video",
        populate: { path: "owner", model: "newUser", select: "name _id avatar" }
      })
      .lean();

    // Filter out likes whose target video was deleted (target may be null)
    const likedVideos = likes
      .filter(l => l.target) // remove null targets
      .map(l => ({
        likedAt: l.createdAt,
        video: l.target
      }));

    const total = await Like.countDocuments({ likedBy: userId, targetType: "Video" });

    return res.json({
      total,
      page,
      limit,
      videos: likedVideos
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};