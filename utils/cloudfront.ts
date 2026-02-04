// utils/cloudfront.js
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export const getStreamingUrl = (key) => {
  return getSignedUrl({
    url: `${process.env.CLOUDFRONT_URL}/${key}`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    dateLessThan: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });
};
