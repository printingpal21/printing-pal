import express from "express";
import multer from "multer";
import { uploadToImgCDN } from "../utils/imgcdn.js";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file" });
    const url = await uploadToImgCDN(file.buffer, file.originalname, file.mimetype);
    res.json({ url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
