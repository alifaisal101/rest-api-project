const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator/check');

const User = require('./../models/user');

exports.register = (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const err = new Error('vaildation error');
        err.statusCode = 422;
        throw err;
    }

    User.findOne({email:req.body.email},['_id']).then(matchingUserFromDb => {
        if(matchingUserFromDb){
            const err = new Error('vaildation error');
            err.statusCode = 422;
            throw err;
        }
        const newUser = {
            name: req.body.name,
            email: req.body.email,
        };

        bcrypt.hash(req.body.password, 12).then(hash => {
            newUser.password = hash;
            User.create(newUser).then(result => {
                res.status(201).json({userId:result._id, massage:"a user was created successfully"});
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
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.login = (req,res,next) => {
    const errors = validationResult(req);
    const {email, password} = req.body;
    if(!errors.isEmpty()){
        const err = new Error('vaildation error');
        err.statusCode = 422;
        throw err;
    }

    User.findOne({email:email}, ['_id', 'password']).then(userFromDb => {
        if(!userFromDb){
            const err = new Error("authentication error");
            err.statusCode = 401;
            throw err;
        }            

        bcrypt.compare(password,userFromDb.password).then(doMatch => {
            if(doMatch){
                crypto.randomBytes(64,(error, buffer) => {
                    if(error){
                        if(!error.statusCode){
                            error.statusCode = 500;
                        }
                        next(error);
                    }
                    const token = jwt.sign(
                        {
                            userId:userFromDb._id
                        },
                        process.env.JWT,
                        {expiresIn:'1h'}
                    );
                    res.status(200).json({token:token, userId:userFromDb._id});
                })
            }else {
                const err = new Error('authentication error');
                err.statusCode = 401;
                throw err;
            }
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