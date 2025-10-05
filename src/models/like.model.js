


// import mongoose, {Schema} from "mongoose";

// const likeSchema = new Schema({
//   targetType: { type: String, enum: ["Video","Message"], required: true },
//   target: { type: Schema.Types.ObjectId, required: true, index: true },
//   likedBy: { type: Schema.Types.ObjectId, ref: "newUser", required: true }
// }, { timestamps: true });

// likeSchema.index({ targetType: 1, target: 1, likedBy: 1 }, { unique: true });

// export const Like = mongoose.model("Like", likeSchema);


// models/like.model.js
import mongoose, { Schema } from "mongoose";

/**
 * NOTE: using `refPath` so `target` can be populated dynamically
 * based on targetType (e.g. "Video" -> Video model).
 */
const likeSchema = new Schema({
  targetType: { type: String, enum: ["Video", "Message"], required: true },
  target: { type: Schema.Types.ObjectId, required: true, index: true, refPath: "targetType" },
  likedBy: { type: Schema.Types.ObjectId, ref: "newUser", required: true }
}, { timestamps: true });

likeSchema.index({ targetType: 1, target: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);




