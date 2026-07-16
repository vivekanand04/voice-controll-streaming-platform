import mongoose from "mongoose";

import { Like } from "../models/like.model.js";
import { Message } from "../models/message.model.js";

export const createMessage = async (req, res) => {
  try {
    const { videoId, content } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({ error: "Invalid videoId" });
    const msg = await Message.create({ video: videoId, author: req.user._id, content });
    const populated = await Message.findById(msg._id).populate("author", "name avatar");
    return res.status(201).json(populated);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ error: "Message not found" });
    if (msg.author.toString() !== req.user._id.toString()) return res.status(403).json({ error: "Forbidden" });
    await Like.deleteMany({ targetType: "Message", target: msg._id });
    await msg.deleteOne();
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const getMessagesByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) return res.status(400).json({ error: "Invalid videoId" });
    const msgs = await Message.find({ video: videoId }).sort({ createdAt: -1 }).populate("author", "name avatar");
    const msgIds = msgs.map(m => m._id);
    if (!req.user) return res.status(200).json({ messages: msgs, likedIds: [] });
    const liked = await Like.find({ targetType: "Message", target: { $in: msgIds }, likedBy: req.user._id }).select("target");
    const likedIds = liked.map(l => l.target.toString());
    return res.status(200).json({ messages: msgs, likedIds });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const toggleLikeOnMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid message id" });
    const existing = await Like.findOne({ targetType: "Message", target: id, likedBy: req.user._id });
    if (existing) {
      await existing.deleteOne();
      const msg = await Message.findByIdAndUpdate(id, { $inc: { likesCount: -1 } }, { new: true });
      return res.status(200).json({ liked: false, likesCount: msg.likesCount });
    } else {
      try {
        await Like.create({ targetType: "Message", target: id, likedBy: req.user._id });
      } catch (err) {
        if (err.code !== 11000) throw err;
      }
      const msg = await Message.findByIdAndUpdate(id, { $inc: { likesCount: 1 } }, { new: true });
      return res.status(200).json({ liked: true, likesCount: msg.likesCount });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
