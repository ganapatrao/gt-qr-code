import { v4 as uuidv4 } from "uuid";
import os from "os";
import { QrGeneratorModel } from "./qrGenerator.model.js";

export const generateQrCode = async (req, res) => {
  try {
    const hostname = os.hostname();
    const sessionId = uuidv4();
    const currentDate = new Date().getTime();
    const validtill = currentDate + 30 * 1000;

    const qrData = {
      sessionId: sessionId,
      createdAt: currentDate,
      validUntil: validtill,
      hostname: hostname,
    };

    const qrGenerator = new QrGeneratorModel(qrData);
    await qrGenerator.save();

    res.status(201).json({ sessionId }); // Return the sessionId in the response
  } catch (error) {
    console.log(error);
    res.send({
      data: {},
      meta: { message: "unable to creatae user at this time" },
    });
  }
};
