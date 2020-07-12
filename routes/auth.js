const express = require('express');
const {body} = require('express-validator/check');

const authController = require('./../controllers/auth');

const Router = express.Router();

Router.put('/register',[
        body('name').isAlpha().isLength({max:32, min:2}),
        body('email').isEmail().isLength({max:100, min:5}),
        body('password').isLength({max:64, min:5}),
    ], 
authController.register);

Router.post('/login',[
        body('email').isEmail().isLength({max:100, min:5}),
        body('password').isLength({max:64, min:5}),
    ],
authController.login);

module.exports = Router;