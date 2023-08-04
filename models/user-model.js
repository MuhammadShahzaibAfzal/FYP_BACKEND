const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique  : true,
        required : true
    },
    firstName : {
        type : String,
        requried : true,
    },
    lastName : {
        type : String,
        requried : true,
    },
    fatherName : {
        type : String,
        requried : true,
    },
    imageURL : String,
    role : {
        type : String,
        enum : ["Student","Teacher","Admin","HOD"],
        default : "Student"
    },
    password : {
        type: String,
        required : true
    },
    // for forget password ?
    resetToken : String,
    // only for student
    rollNumber : String,
    batch : {
        type : String,
        ref : "Batch"
    },
    departement : {
        type : String,
        ref : "Departement"
    },
    accountStatus:{
        type : String,
        enum : ["Active","Disable"],
        default : "Active"
    }
},{timestamps : true});

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel; 