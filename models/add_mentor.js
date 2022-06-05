const mongoose = require("mongoose");

const addSchema = new mongoose.Schema({
    img:
    {
        type: String
    },
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
   isApproved: {
       type: Boolean,
       default:false
   }
})

//creating collection

const Addmentor = new mongoose.model("Addmentor", addSchema);




module.exports = Addmentor;

