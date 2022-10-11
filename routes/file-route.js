import multer from "multer";
import { Router } from "express";
import { checkAuth } from "../utils/index.js";
import * as uuid from "uuid";

const router = new Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.post("/", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

export default router;
