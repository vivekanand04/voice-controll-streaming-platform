import { Router } from "express";
import { deleteAccount, registerUser, login, updateAccount, logoutUser, refreshAccessToken, getUserById, GetWatchHistory, addToWatchHistory } from "../controllers/account.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/delete/:id").delete(deleteAccount)
router.route("/update/:id").put(upload.single("avatar"), updateAccount);
  router.route("/userData/:id").get(getUserById)
router.route("/history").get(verifyJWT, GetWatchHistory)
router.route("/addToHistory/:id").put(verifyJWT, addToWatchHistory)





// const Video = require('../models/video.model');
import { Video } from "../models/video.model.js";

router.get("/search", async (req, res) => {


  try {
    // const { query } = req.query.query || "";
    const query = (req.query.q || "").trim();


    // const videos = await Video.find({
    //   title: { $regex: query, $options: "i" } // case-insensitive search
    // });
    const videos = await Video.find({ title: new RegExp(query, "i") })
      .populate("owner", "name avatar"); // Only bring name and avatar fields
   


    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err });
  }
});



export default router