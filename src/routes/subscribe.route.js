import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import Subscription from "../models/subscription.model.js";
import mongoose from "mongoose";

const router = Router();

router.post("/:channelId/subscribe", verifyJWT, async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;

    if (channelId === userId) {
      return res.status(400).json({ msg: "You cannot subscribe to yourself" });
    }

    const existing = await Subscription.findOne({ subscriber: userId, channel: channelId });

    if (existing) {
      await Subscription.findByIdAndDelete(existing._id);
      return res.json({ msg: "Unsubscribed successfully", subscribed: false });
    } else {
      const subscription = await Subscription.create({ subscriber: userId, channel: channelId });
      return res.status(201).json({ msg: "Subscribed successfully", subscribed: true, subscription });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// router.post("/:channelId/subscribe", verifyJWT, async (req, res) => {
//   try {
//     const { channelId } = req.params;
//     const userId = req.user.id; // subscriber from auth token

//     if (channelId === userId) return res.status(400).json({ msg: "You cannot subscribe to yourself" });

//     const subscription = await Subscription.create({ subscriber: userId, channel: channelId });
//     res.status(201).json(subscription);
//   } catch (err) {
//     if (err.code === 11000) return res.status(400).json({ msg: "Already subscribed" });
//     res.status(500).json({ msg: "Server error" });
//   }
// });


// router.delete("/:channelId/unsubscribe", verifyJWT, async (req, res) => {
//   try {
//     const { channelId } = req.params;
//     const userId = req.user.id;

//     await Subscription.findOneAndDelete({ subscriber: userId, channel: channelId });
//     res.json({ msg: "Unsubscribed successfully" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

router.get("/:channelId/status", verifyJWT, async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user.id;

  const subscribed = await Subscription.exists({ subscriber: userId, channel: channelId });
  res.json({ subscribed: !!subscribed });
});

router.get("/:channelId/count", async (req, res) => {
  const { channelId } = req.params;

  const count = await Subscription.countDocuments({ channel: channelId });
  res.json({ count });
});



router.get("/mine", verifyJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("[subs/mine] userId:", userId, "typeof:", typeof userId);

    // helper to safely create ObjectId or null
    const toObjectId = (id) => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (e) {
        return null;
      }
    };
    const objId = toObjectId(userId);

    // quick counts to understand what's in DB (string vs ObjectId storage)
    const countByString = await Subscription.countDocuments({ subscriber: userId }).catch(() => 0);
    const countByObject = objId ? await Subscription.countDocuments({ subscriber: objId }).catch(() => 0) : 0;
    console.log(`[subs/mine] countByString=${countByString}, countByObject=${countByObject}`);

    if (countByString === 0 && countByObject === 0) {
      return res.json({
        success: true,
        data: [],
        debug: { note: "no matching subscription documents for this user", countByString, countByObject }
      });
    }

    // Accept either string or ObjectId subscriber
    const matchClause = objId ? { $or: [{ subscriber: objId }, { subscriber: userId }] } : { subscriber: userId };

    // Determine actual user collection name & model registered (handles "User" vs "newUser")
    let userCollection = "users"; // default fallback
    let populatedModelName = null;
    if (mongoose.models && mongoose.models.User) {
      populatedModelName = "User";
      userCollection = mongoose.models.User.collection.name;
    } else if (mongoose.models && mongoose.models.newUser) {
      populatedModelName = "newUser";
      userCollection = mongoose.models.newUser.collection.name;
    } else {
      // if neither model is registered, try to infer common collection names (best-effort)
      // leave userCollection as "users" (default)
      console.warn("[subs/mine] No User model registered; using default collection name 'users' for lookup");
    }
    console.log("[subs/mine] using collection:", userCollection, "populateModel:", populatedModelName);

    // Aggregation: group channels, lookup channel info using detected collection name, and get subscribers count
    const results = await Subscription.aggregate([
      { $match: matchClause },
      { $group: { _id: "$channel" } },
      {
        $lookup: {
          from: userCollection,
          localField: "_id",
          foreignField: "_id",
          as: "channel"
        }
      },
      { $unwind: { path: "$channel", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: Subscription.collection.name, // "subscriptions" (uses actual collection name)
          let: { channelId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$channel", "$$channelId"] } } },
            { $count: "count" }
          ],
          as: "countDoc"
        }
      },
      {
        $addFields: {
          subscribersCount: { $ifNull: [{ $arrayElemAt: ["$countDoc.count", 0] }, 0] }
        }
      },
      {
        $project: {
          _id: 0,
          channelId: "$channel._id",
          channelName: "$channel.name",
          channelAvatar: "$channel.avatar",
          channelBio: "$channel.bio",
          subscribersCount: 1
        }
      }
    ]);

    // If aggregation empty but counts > 0, fallback to populate or direct lookup
    if (!results || results.length === 0) {
      console.log("[subs/mine] aggregation returned empty — falling back to alternate approach");

      // Try populate with detected model name if available
      if (populatedModelName) {
        const subs = await Subscription.find({ subscriber: userId }).populate({ path: "channel", model: populatedModelName, select: "name avatar bio" }).lean();
        const mapped = await Promise.all(subs.map(async (s) => {
          const chan = s.channel;
          if (!chan) return null;
          const subscribersCount = await Subscription.countDocuments({ channel: chan._id }).catch(() => 0);
          return {
            channelId: chan._id,
            channelName: chan.name,
            channelAvatar: chan.avatar,
            channelBio: chan.bio,
            subscribersCount
          };
        }));
        return res.json({
          success: true,
          data: mapped.filter(Boolean),
          debug: { usedFallback: true, method: "populateModel", populatedModelName, countByString, countByObject, subsFound: mapped.length }
        });
      }

      // Last-resort: query user collection directly via DB driver
      const subsRaw = await Subscription.find({ subscriber: userId }).lean();
      const mappedDirect = await Promise.all(subsRaw.map(async (s) => {
        const chanId = toObjectId(s.channel) || s.channel;
        if (!chanId) return null;
        const chanDoc = await mongoose.connection.db.collection(userCollection).findOne({ _id: chanId });
        if (!chanDoc) return null;
        const subscribersCount = await Subscription.countDocuments({ channel: chanDoc._id }).catch(() => 0);
        return {
          channelId: chanDoc._id,
          channelName: chanDoc.name,
          channelAvatar: chanDoc.avatar,
          channelBio: chanDoc.bio,
          subscribersCount
        };
      }));

      return res.json({
        success: true,
        data: mappedDirect.filter(Boolean),
        debug: { usedFallback: true, method: "directCollectionLookup", userCollection, countByString, countByObject, subsFound: mappedDirect.length }
      });
    }

    return res.json({
      success: true,
      data: results,
      debug: { usedFallback: false, countByString, countByObject, aggCount: results.length, userCollection, populatedModelName }
    });

  } catch (err) {
    console.error("Error listing subscriptions:", err);
    return res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
});

export default router;