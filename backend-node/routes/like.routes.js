import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { toggleLikeVideo,listLikedVideos } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/video/:id", toggleLikeVideo); // toggle like on video
router.get("/videos", listLikedVideos);

export default router;
