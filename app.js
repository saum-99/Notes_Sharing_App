const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');

require("./db/conn");
const Register = require("./models/registers"); 
const userSchema = require("./models/registers");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/courses", (req, res) => {
    res.render("courses")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/signUp", (req, res) => {
    res.render("signUp");
})

app.post("/signUp", async(req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.password1;

        if(password === cpassword){
          const registerUser = new Register({ 
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.password1

        })

        const registered = await registerUser.save();
        res.status(201).render("index"); 

        }else{
            res.send("password are not matching");
        } 
    
    } catch(error) {
        res.status(400).send(error);
    }

})


/*app.post('/signUpForm',function(req, res){

    //var query = { email: req.body };
    //console.log(query);
    //userSchema.collection("Register").find(query).toArray(function(err, result) {
    
        Register.Register.find({'email':req.body }, function(err, user) {

            if (err) {
                res.send(nottaken);
            }
       
            console.log(user);
            //if user found.
            if (user.length!=0) {
              if(user.email){

                res.send(taken);      
                 
            }                                    
                 var err = new Error();
                err.status = 310;
                return done(err);

            }
});

}) */

app.get("/logIn", (req, res) => {
    res.render("login");
})

app.post('/logIn', async(req, res) => {
    try {
        
    }catch(err){
        res.status(400).send("Invalid email or password");
    }
})

app.listen(8080, ()=>{
    console.log("Server started..")
});