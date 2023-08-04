const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type : String,
        unique  : true,
        required : true
    },
    description : {
        type : String,
        requried : true,
    },
    imagePath : {
        type : String,
        required : true,
    }
},{timestamps : true});
const CategoryModel = mongoose.model("Category",categorySchema);

module.exports = CategoryModel; 