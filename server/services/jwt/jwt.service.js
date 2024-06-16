import { JWT_PWD, ACCESS_EXP_IN, REFRESH_EXP_IN } from "./jwt.config.js";
import jwt, { decode } from "jsonwebtoken";
import { userTokenModel } from "./jwttokwn.model.js";

/**
 * @description {Method to create JWT and refresh token}
 * @param {*} payload
 *  @returns {Object} Contains the generated access and refresh tokens
 */

export const generateToken = async (payload) => {
  //accepts plain object ==> var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  //generate access token

  try {
    if (!JWT_PWD || !payload.userId || !ACCESS_EXP_IN || !REFRESH_EXP_IN) {
      throw new Error("Missign required env variables");
    }

    //generate access token
    const accessToken = jwt.sign(payload, JWT_PWD, {
      expiresIn: ACCESS_EXP_IN,
    });

    //generate refresh token with 1 year validity
    const refreshToken = jwt.sign(payload, JWT_PWD, {
      expiresIn: REFRESH_EXP_IN,
    });

    console.log("200", payload.userId);
    //Find user token in the database
    const userTokenData = await userTokenModel.findOne({
      userId: payload.userId,
    });

    //query https://github.com/xDAnkit/qr-login/commit/c970015642c9267b9f39adfc70d25fb83a257077

    if (!userTokenData) {
      // Create a new record if user token data doesn't exist
      const newUserTokenData = new userTokenModel({
        userId: payload.userId,
        accessTokens: [accessToken],
        refreshTokens: [refreshToken],
      });

      await newUserTokenData.save();
      return { accessToken, refreshToken };
    }

    userTokenData.accessTokens.push(accessToken);
    userTokenData.refreshTokens.push(refreshToken);
    await userTokenData.save();

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error generating tokens:", error);
    // Return an error response or rethrow the error based on your application needs
    return { error: "Token generation failed" };
  }
};

/**
 * @description Methode to validate jwt token
 * @param {string} token - the JWT token to validate
 * @returns {object} decoded payload if the token is valid, otherwise an error message
 */

export const validateToken = (token) => {
  try {
    if (!JWT_PWD) {
      throw new Error("Missing required environment variable: JWT_PWD.");
    }

    const decoded = jwt.verify(token, JWT_PWD);

    if (decoded) {
      return { valid: true, userInfo: decoded };
    }
  } catch (error) {
    console.log("Error validating token:", error);
    return { valid: false, error: error.message };
  }
};

/**
 * @description Method to regenerate a new access token using the refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Object} Contains the new generated access token or an error message
 */

export const regenerateToken = async (refreshToken) => {
  try {
    // const newAccessToken = jwt.sign(decoded, JWT_PWD, { expiresIn: "1h" });
    const decoded = jwt.verify(refreshToken, JWT_PWD);
    const userData = await userTokenModel.findOne({
      userId: decoded.userId,
    });

    //?? go through again
    if (!userData && !userData?.refreshTokens.includes(refreshToken)) {
      throw new Error("Invalid token is provided");
    }
    const newAccessToken = jwt.sign(decoded, JWT_PWD, { expiresIn: "1h" });
    return { newAccessToken };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

/**
 * @description Method to destroy a JWT token
 * @param {string} token - The JWT token to destroy
 * @returns {Object} Confirmation message of token destruction
 */
export const destroyToken = async (token, type) => {
  // JWT tokens are stateless and cannot be destroyed server-side.
  // To 'destroy' a token, it must be invalidated on the client side, or added to a deny list on the server.
  try {
    // if (type !== "refreshTokens" && type !== "accessTokens") {
    if (!["refreshTokens", "accessTokens"].includes(type)) {
      throw new Error("Please provide a valid token type.");
    }

    const { userId } = jwt.verify(token, JWT_PWD);

    if (!userId) {
      throw new Error("token is not valid");
    }

    // Update the user document to remove the provided token from the specified type of tokens
    const result = await userTokenModel.updateOne(
      { userId },
      { $pull: { [type]: token } }
    );

    // Check if the update operation was successful
    if (result.nModified === 0) {
      throw new Error("Token not found or user not authorized.");
    }

    return {
      message:
        "Token destruction should be handled on the client side or by maintaining a deny list on the server.",
    };
  } catch (err) {
    return {
      message: err.message || "An error occurred during token destruction.",
    };
  }
};

/**
 * @description Method to decode a JWT token without verifying its signature
 * @param {string} token - The JWT token to decode
 * @returns {Object} Decoded payload or an error message
 */
export const decodeToken = (token) => {
  try {
    const decoded = jwt.decode(token, JWT_PWD);
    return { decoded };
  } catch (error) {
    return { error: error.message };
  }
};
