const { validationResult } = require('express-validator/check');

const Post = require('./../models/post');

exports.getPosts = (req,res,next) => {
    Post.find().then(postsFromDb => {
        const posts = postsFromDb.map(post => {
            return {
            ...post._doc,
            creator: {
                name:"ali"
            }
        }});    
        res.status(200).json({posts});

    }).catch((err) => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.createPost = (req,res,next) => {
    const post = {
        title:req.body.title, 
        content:req.body.content, 
        creator:req.body.creator,
        image:'/data/images/posts-images/test.jpg'
    };

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Vaildation Failed');
        error.statusCode = 422;
        throw error;
    }

    Post.create(post).then(postCreationRes => {
        res.status(201).json({post:postCreationRes});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getPost = (req,res,next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('Vaildtion error');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId).then(postFromDb => {
        if(!postFromDb){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({post:postFromDb});
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}