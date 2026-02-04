// utils/isSubscribed.js
import Subscription from "../db/models/subscription.model.ts";

export const isSubscribed = async (userId, creatorId) => {
  return await Subscription.exists({
    subscriber: userId,
    creator: creatorId,
  });
};
