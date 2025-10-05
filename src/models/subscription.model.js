import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subscriptionSchema = new mongoose.Schema({
  subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who subscribes
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // who gets subscribed
}, { timestamps: true });

subscriptionSchema.index({ subscriber: 1, channel: 1 }, { unique: true }); 

export default model("Subscription", subscriptionSchema);
