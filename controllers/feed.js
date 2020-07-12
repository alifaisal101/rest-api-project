const fs = require('fs');

const { validationResult } = require('express-validator/check');

const conFunctions = require('./../util/con-functions');

const Post = require('./../models/post');

exports.getPosts = (req,res,next) => {
    const currentPage = req.query.page || 1;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const err = new Error('vaildation error');
        err.statusCode = 422;
        throw err;
    }

    Post.find().countDocuments().then(count => {
        if(!count){
            const err = new Error('error while counting the docments');
            err.statusCode = 500;
            throw err
        }
        let numberOfPages;

        if(count%2){
            numberOfPages = Math.floor(count/2) + 1;
        }else {
            numberOfPages = count/2;
        }

        if(currentPage > numberOfPages){
            const err = new Error('invaild page');
            err.statusCode = 404;
            throw err;
        }

        Post.find().skip((currentPage-1)*2).limit(2).then(postsFromDb => {
            const posts = postsFromDb.map(post => {
                return {
                ...post._doc,
                creator: {
                    name:"ali"
                }
            }});    
            res.status(200).json({posts:posts, totalItems:count});
        }).catch((err) => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.createPost = (req,res,next) => {
    const image = req.file;
    if(!image){
        const error = new Error('no image provided');
        error.statusCode = 422;
        throw error;
    }

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        conFunctions.clearImage(image.filename);
        const error = new Error('Vaildation Failed');
        error.statusCode = 422;
        throw error;
    }

    const post = {
        title:req.body.title, 
        content:req.body.content, 
        creator:{
            name :req.body.name
        },
        image:image.filename
    };

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

exports.updatePost = (req,res,next) => {
    const postId = req.params.postId;
    const image = req.file;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        if(image){
            conFunctions.clearImage(image.filename);
        }
        const error = new Error('vaildation error');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId).then(postFromDb => {
        if(!postFromDb){
            const error = new Error('no post found');
            error.statusCode = 404;
            throw error;
        }
        const updatedPost = {
            ...postFromDb._doc
        }

        updatedPost.content = req.body.content;
        updatedPost.title = req.body.title;

        if(image){
            updatedPost.image = image.filename;
        }

        Post.updateOne({_id:postId},updatedPost).then(() => {
            conFunctions.clearImage(postFromDb.image);
            res.status(200).json({massage:"post update successfully", post:updatedPost});
        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.deletePost = (req,res,next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('vaildation error');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId).then(postFromDb => {
        if(!postFromDb){
            const error = new Error('no post found');
            error.statusCode = 404;
            throw error;
        }
        Post.deleteOne({_id:postId}).then(() => {
            conFunctions.clearImage(postFromDb.image);
            res.status(200).json({massage:"post deleted successfully"});
        }).catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        });
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}