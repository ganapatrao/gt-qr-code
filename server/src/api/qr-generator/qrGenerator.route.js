import { generateQrCode } from "./qrGenerator.controller.js";
import Express from "express";
const qrRouter = Express.Router();

qrRouter.get("/", generateQrCode);

export default qrRouter;
