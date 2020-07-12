const path = require('path');
const crypto = require('crypto');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const rootDir = require('./util/rootDir');

const authRouter = require('./routes/auth');
const feedRouter = require('./routes/feed.js');

const app = express();
const errorHandlerListener = express();

const fileStorage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, path.join(rootDir, 'public', 'data', 'images', 'posts-images'));
    },
    filename: (req,file,cb) => {
        crypto.randomBytes(6, (err, buffer) => {
            cb(null, new Date().toISOString() + buffer.toString('hex') + file.originalname);
        });
    }
});

const fileFilter = (req,file,cb) => {
    if (
        (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/bmp" ||
            file.mimetype === "image/gif" ||
            file.mimetype === "image/jpeg" 
        ) && (
            file.originalname.split('').length < 120
        )
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
}

errorHandlerListener.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next();
});

errorHandlerListener.use((req,res,next) => {
    res.status(500).json({msg:"connecting to database failed"});
});

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

app.use(multer({storage:fileStorage, fileFilter:fileFilter}).single('image'));

app.use(express.static(path.join(rootDir, 'public')));

app.use("/feed",feedRouter);
app.use("/auth", authRouter);

app.use((error, req,res,next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        msg:error.message
    });
});
  
mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT);
}).catch(err => {errorHandlerListener.listen(5000);}); 