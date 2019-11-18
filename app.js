const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const rootDir = require('./util/rootDir');

const feedRouter = require('./routes/feed.js');

const app = express();
const errorHandlerListener = express();

errorHandlerListener.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', "POST");
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next();
});

errorHandlerListener.use((req,res,next) => {
    res.status(500).json({msg:"connecting to database failed"});
});

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', "POST");
    res.setHeader("Access-Control-Allow-Headers", 'Content-Type, Authorization');
    next();
});

app.use(bodyParser.json());

app.use(express.static(path.join(rootDir, 'public')));

app.use("/feed",feedRouter);

app.use((error, req,res,next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        msg:error.message
    });
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT);
}).catch(err => {errorHandlerListener.listen(5000);}); 