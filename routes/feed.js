const express = require('express');
const {body, param, query} = require('express-validator/check');

const isAuth = require('./../middlewares/is-auth').isAuth;

const feedController = require('./../controllers/feed');

const router = express.Router();

router.get('/posts',isAuth,[
        query('page').custom(page => {
            if(page){
                if(page >= 1){
                    return true;
                }else {
                    throw "invaild page";
                }
            }{
                return true;
            }
        })
    ],
feedController.getPosts);

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

router.patch('/post/:postId', [
        param('postId').isMongoId(),
        body('title').isLength({min:5, max:64}),
        body('content').isLength({min:5, max:2000})
    ],
    feedController.updatePost
);

router.delete('/post/:postId', [
        param('postId').isMongoId()
    ],
    feedController.deletePost
);

module.exports = router;
