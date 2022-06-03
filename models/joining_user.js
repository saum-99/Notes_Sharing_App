const mongoose = require("mongoose");

const joinuserSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
    },
    subject: {
        type:String    
   },
   message:{
       type: String
   }

})

//creating collection
const Join_user = new mongoose.model("JoinUser", joinuserSchema);

module.exports = Join_user;

