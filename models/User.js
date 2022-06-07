const mongoose = require("mongoose");

const validUserSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String, 
        required:true     
   },
   uniqueString: {
        type:String,
        required:true   
   }
})

//creating collection

const User = new mongoose.model("User", validUserSchema);




module.exports = User;

