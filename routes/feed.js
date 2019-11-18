const express = require('express');
const {body, param} = require('express-validator/check');

const feedController = require('./../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post("/post",[
        body('title').isLength({min:5, max:64}),
        body('content').isLength({min:5, max:2000})
    ], feedController.createPost
);

router.get('/post/:postId',[
        param('postId').isMongoId()
    ],
    feedController.getPost
);

module.exports = router;
