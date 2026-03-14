const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});
//passport defines a username and password for user using hashing and salting we do not need to do that

User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);