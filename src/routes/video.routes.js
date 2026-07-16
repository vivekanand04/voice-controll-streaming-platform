import { Router } from "express";
import { publishAVideo , getAllVideos , getAllUserVideos , deleteVideoById , VideoDataById , viewsIncrement ,toggleLikeVideo} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();



const videoUpload = upload.fields([
    { name:'thumbnail', maxCount: 1 },
    { name:'videoFile', maxCount: 1 },
    // { name: 'avatar', maxCount: 1 } // Add this if you are uploading avatar
  ]);

// Public routes - no authentication required
router.route("/allVideo").get(getAllVideos)
router.route("/allUserVideo/:owner").get(getAllUserVideos)
router.route("/videoData/:id").get(VideoDataById)
router.route("/incrementView/:id").put(viewsIncrement)

// Protected routes - require authentication
router.route("/publish").post(verifyJWT, videoUpload, publishAVideo)
router.route("/delete/:id").delete(verifyJWT, deleteVideoById)
router.route("/:id/like").put(verifyJWT, toggleLikeVideo);

export default router