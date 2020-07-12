const mongoose = require("mongoose");

const comProps = {
    type:String,
    required: true
}

const userSchema = new mongoose.Schema({
    name:comProps,
    email:{...comProps, unique:true},
    password:comProps,
    status:{
        type:String,
        default:"new"
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);