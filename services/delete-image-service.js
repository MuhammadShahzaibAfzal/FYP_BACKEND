const path = require("path");
const fs = require("fs");

function deleteImage(imagePath) {
    fs.unlink(path.join(appRoot, imagePath),(err)=>{
        if(err){
            throw err;
        }
    });
}

module.exports = deleteImage;