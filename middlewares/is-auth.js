const jwt = require('jsonwebtoken');

exports.isAuth = (req,res,next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const err = new Error('not authenticated');
        err.statusCode = 401;
        throw err;
    }

    const token = authHeader.split(' ')[1]
    if(!token){
        const err = new Error('not authenticated');
        err.statusCode = 401;
        throw err;
    }

    let result;
    try {
        result = jwt.verify(token, process.env.JWT);
    }catch(err) {
        err.statusCode = 500;
        throw err;
    }

    if(!result){
        const err = new Error('invaild token');
        err.statusCode = 401;
        throw err;
    }
    
    res.userData = {
        userId:result.userId
    }

    console.log(result.userId);
    next();
}