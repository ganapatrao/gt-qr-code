import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "userID is required"],
  },
  accessTokens: {
    type: [String],
    required: [true, "Access tokens arerequired"],
  },
  refreshTokens: {
    type: [String],
    required: [true, "Refresh tiokens are required"],
  },
});


export const userTokenModel = mongoose.model("UserTokens",userTokenSchema)