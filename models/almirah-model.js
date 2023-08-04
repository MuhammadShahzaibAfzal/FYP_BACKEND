const mongoose = require("mongoose");

const almirahSchema = new mongoose.Schema({
    number : {
        type : String,
        unique  : true,
        required : true
    },
    subject : {
        type : String,
        requried : true,
    }
},{timestamps : true});

const AlmirahModel = mongoose.model("Almirah",almirahSchema);

module.exports = AlmirahModel; 