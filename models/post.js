const mongoose = require('mongoose');

const comProps = {
    required:true,
    type:String
}

const postSchema = new mongoose.Schema({
    title:comProps,
    image:comProps,
    content:comProps,
    creator:{
        name : comProps
    }
}, {timestamps:true});

module.exports = mongoose.model("post", postSchema);