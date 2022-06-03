const mongoose = require("mongoose");

const addSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type:String, 
        required:true     
   },
   isApproved: false
})

//creating collection

const Addmentor = new mongoose.model("Addmentor", addSchema);




module.exports = Addmentor;

