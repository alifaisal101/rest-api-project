const fs = require('fs');
const path = require('path');

const rootDir = require('./rootDir');

exports.clearImage = image => {
    fs.unlink(path.join(rootDir, 'public', 'data', 'images', 'posts-images', image) ,(err) => {
       if(err){console.log(err);}
    });
}