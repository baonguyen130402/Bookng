const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");

const User = require("./app/models/user.model");

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONG_URL = process.env.MONGO_URL;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = app.use(express.json());

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(cors({
  credentials: true,
  origin: "https://bookng.netlify.app",
  // origin: "http://localhost:5173"
}));

// Photomiddlewares
const photosMiddleware = multer({ dest: "uploads" });

mongoose.connect(MONG_URL).then(() => console.log("Connected"));

app.get("/test", (_, res) => {
  res.json(
    "test successfully",
  );
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User
      .create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt),
      });

    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const account = await User.findOne({ email });

  if (account) {
    const authPasswd = bcrypt.compareSync(password, account.password);

    if (authPasswd) {
      jwt.sign(
        {
          email: account.email,
          id: account._id,
          name: account.name,
        },
        JWT_SECRET_KEY,
        (err, asyncToken) => {
          if (err) throw err;
          res.cookie("token", asyncToken).json(account);
        },
      );
    } else {
      res.status(422).json("wrong password");
    }
  } else {
    res.json("Not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;

  token
    ? jwt.verify(token, JWT_SECRET_KEY, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    })
    : res.json(null);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];

  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }
  res.json(uploadedFiles);
});

app.listen(PORT);
