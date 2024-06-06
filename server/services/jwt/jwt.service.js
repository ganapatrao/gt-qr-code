import { JWT_KEY } from "./jwt.config.js";
import jwt from "jsonwebtoken";

/**
 * @description {Method to create JWT token}
 * @param {*} payload
 */

export const generateToken = (payload) => { //accepts plain object ==> var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
  const accesstoken = jwt.sign(payload, JWT_KEY);
  return accesstoken;
};

export const validateToken = () => {};
export const regenerateToken = () => {};
export const destroyToken = () => {};
export const decodeToken = () => {};
