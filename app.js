const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const auth = require("./middleware/auth");
const cookieParser = require('cookie-parser');


require("./db/conn");
const Register = require("./models/registers"); 
//const userSchema = require("./models/registers");
const userNote = require("./models/userNotes");
const video = require("./models/videos");
const joinUser = require("./models/joining_user");
const addMentor = require("./models/add_mentor");

// get config vars
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/courses", (req, res) => {
    res.render("courses")
})

app.get("/contact", async (req, res) => {
    const joinedMentor = await joinUser.find({});
    res.render("contact", {joinedMentor : joinedMentor});
})

app.get("/signUp", (req, res) => {
    res.render("signUp");
})



app.post("/signUp", async(req, res)=>{
    //try{
        const email = req.body.email;
        const oldUser = await Register.findOne({email: email});

        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }

        const password = req.body.password;
        const cpassword = req.body.password1;
        const user_id = req.body.id;

        if(password === cpassword){
          const registerUser = new Register({ 
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmpassword: req.body.password1

        })

        /*const token = await jwt.sign({user_id}, process.env.SECRET_KEY,{
            expiresIn: "5h",
        }); */

        const registered = await registerUser.save();
        //console.log(registerUser);
        /*return res.cookie("access_token", token, {
            httpOnly: true
        })*/
        res.status(201).redirect("login"); 
        
        }
        
        else{
            res.send("password are not matching");
        } 
    
    //} 

})

app.get("/logIn", (req, res) => {
    res.render("login");
});

app.get("/videos", (req, res) => {
    res.render("videos");
});

app.post('/logIn', async(req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email});
        //const user_id = useremail.id;
        //console.log(useremail);
          
        if(useremail.password === password){
            const token = await jwt.sign({id: useremail.id, username: useremail.username, email: useremail.email}, process.env.SECRET_KEY,{
                expiresIn: "5h",
            });
            
            //doubt..........login krte m token naya bnega vo bhi save krna pdega kya??

            console.log(JSON.stringify(token));
            return res.cookie("access_token", token, {
                httpOnly: true
            }).status(201).render("index")
        } else{
            res.send("invalid login details");
        }

    }catch(err){
        res.status(400).send(err);
    }
});

app.post("/sharenote", async (req, res) => {
    //try{
        //console.log(req.body);
        const userNoteshare = new userNote({
            email: req.body.email,
            subject: req.body.subject,
            link: req.body.link

        })

        const userNoteshared = await userNoteshare.save();
        res.status(201).render("courses");

    //} 
});

app.get("/dummy", (req, res) =>{
    res.render("dummy")
})

app.get("/join", (req, res) => {
    res.render("join")
});

app.post("/sharevideo", async (req, res) => {
        const videoshare = new video({
            subject: req.body.subject,
            link: req.body.link
        })

        const videoshared = await videoshare.save();
        res.status(201).render("dummy");

})

app.post("/accessnote", auth, async (req, res) => {
    const subject = req.body.subject;

    if(subject){
        const subjectaccess = await userNote.find({ subject: subject});
        res.render("access", {subjectaccess : subjectaccess});
    }
    else{
        res.send("No subject");
    }
});

app.post("/accessvideos", async(req, res) => {
    const subject = req.body.subject;

    if(subject){
        const subjectaccess = await video.find({ subject: subject});
        res.render("videoaccess", {subjectaccess : subjectaccess});
    }
    else{
        res.send("No subject");
    }
})

app.post("/join", async (req, res) => {
    const Addmentor = new addMentor({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message

    })

    const addedMentor = await Addmentor.save();
    
    res.redirect("/");
});

app.get("/approve", async (req, res) => {
    const mentors = await addMentor.find({});
    res.render("display_msg", {mentors: mentors});

});

app.post("/approve", async (req, res) => {
    
    const mentor = new joinUser({
        name: req.body.approve.name,
        email: req.body.approve.email,
        subject: req.body.approve.subject,
        message: req.body.approve.message
    })

    const addMentor = await mentor.save();
    res.redirect("/approve");
})


app.listen(8080, ()=>{

    console.log("Server started..")
});