const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/signUpForm", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`connection is successful`);
}).catch((e)=>{
    console.log(`no connection done`, e);
});


module.exports= mongoose;