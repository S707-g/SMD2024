const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    method: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const storage = multer.diskStorage({
  destination: function (reg, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (reg, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension);
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path.replace("\\", "/");
    return res.status(200).json({ path: process.env.UPLOAD_PATH + filePath });
  } catch (err) {
    return res.status(500).json({
      message: "Upload failed",
      err,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port" + process.env.PORT);
});
