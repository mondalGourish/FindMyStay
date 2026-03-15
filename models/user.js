const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    }
});
//passport defines a username and password for user using hashing and salting we do not need to do that
// console.log(typeof passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);