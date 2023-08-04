const mongoose = require("mongoose");

const departementSchema = new mongoose.Schema({
    name : {
        type : String,
        unique  : true,
        required : true
    },
    hod : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{timestamps : true});

const DepartementModel = mongoose.model("Departement",departementSchema);

module.exports = DepartementModel; 