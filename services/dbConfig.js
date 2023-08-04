const mongoose = require("mongoose");

function dbConfig() {
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('MongoDB database connected successfully ✅✅');
    })
    .catch((err)=>{
        console.log('Something went wrong while connecting to MongoDB database ❎❎');
        console.log(err);
    });
}

module.exports = dbConfig;