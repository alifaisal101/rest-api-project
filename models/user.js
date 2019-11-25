const mongoose = require("mongoose");

const comProps = {
    type:String,
    required: true
}

const userSchema = new mongoose.Schema({
    firstName:comProps,
    lastName:comProps,
    email:comProps,
    password:comProps
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);