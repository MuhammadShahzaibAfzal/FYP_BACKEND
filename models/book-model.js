const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
      user : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'User',
         required : true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );


const bookSchema = new mongoose.Schema({
    ISBN : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    almirah:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Almirah',
        required : true
    },
    shelf : {
        type : String,
        enum : ["1","2","3","4"],
        required : false
    },
    imagePath : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Available","Reserved","Issued","Lost"],
        default : "Available"
    },
    publisher : String,
    description : String,
    edition : String,
    reviews : [reviewSchema],
    tags : [String],
    
},{timestamps:true});

const BookModel = mongoose.model("Book",bookSchema);

module.exports = BookModel;