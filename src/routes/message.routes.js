import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createMessage,
  deleteMessage,
  getMessagesByVideo,
  toggleLikeOnMessage
} from "../controllers/message.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/", createMessage); // create message
router.get("/video/:videoId", getMessagesByVideo); // get all messages for a video
router.delete("/:id", deleteMessage); // delete own message
router.post("/:id/like", toggleLikeOnMessage); // like/unlike message

export default router;
