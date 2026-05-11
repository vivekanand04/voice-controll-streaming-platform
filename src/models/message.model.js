import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema({
  video: { type: Schema.Types.ObjectId, ref: "Video", required: true },
  author: { type: Schema.Types.ObjectId, ref: "newUser", required: true },
  content: { type: String, required: true, trim: true },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
