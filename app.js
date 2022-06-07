const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const emailValidator = require('email-validator');
const nodemailer = require('nodemailer');


require("./db/conn");
const Register = require("./models/registers"); 
//const userSchema = require("./models/registers");
const userNote = require("./models/userNotes");
const video = require("./models/videos");
const User = require("./models/User")
//const joinUser = require("./models/joining_user");
const addMentor = require("./models/add_mentor");
const { getMaxListeners } = require('process');


// get config vars
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const static_path = path.join(__dirname, "/public");
app.use(express.static(static_path));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const randString = () => {
    const len = 8;
    let randStr = '';
    for(let i=0; i<len; i++){
        const ch = Math.floor((Math.random()*10) + 1);
        randStr += ch
    }
    return randStr;
}

const sendMail = (email, uniqueString) => {
    const transport = nodemailer.createTransport({
        service: "Gmail" ,
        auth: {
            user: "saumya.18245@knit.ac.in",
            pass: "29-Sa-19-Sh"
        }
    });

    const options = {
        from: "saumya.18245@knit.ac.in",
        to: email,
        subject: "Sending mail with nodejs",
        html: `Press <a href=http://localhost:8080/verify/${uniqueString}> here </a> to verify your email. Thanks`
    };
    
    transport.sendMail(options, function(err, info) {
        if(err) {
            console.log(err); 
            return;
        }
        console.log("Message Sent");
    });
}

app.get('/verify/:uniqueString', async(req, res) => {
    const { uniqueString } = req.params;
    console.log(uniqueString);
    const user = await User.findOne({uniqueString: uniqueString})
    if(user){
        //console.log(user);
        const registerUser = new Register({ 
            username: user.username,
            email: user.email,
            password: user.password,
            confirmpassword: user.password

        })

        const registered = await registerUser.save();
        res.status(201).render("login"); 
    }
    else{
        res.json('User not found');
    }
});

//sendMail("saumyash299@gmail.com", randString());

const verifyToken = (req, res, next) => {
    if(typeof(req.headers.cookie) == 'undefined'){
        next();
    }
    else{
        //console.log(req.headers.cookie)
        let hash = (req.headers.cookie.split('=')[1]);
        //console.log(hash)
        jwt.verify(hash, process.env.TOKEN_KEY, (err, decoded) => {
            if(err){
            }
            else
            req.isLoggedIn = decoded;
        })
        next();
    }
};

app.get("/", verifyToken,(req, res) => {
res.render("index", {user: req.isLoggedIn});
});

app.get("/about", verifyToken, (req, res) => {
    res.render("about", {user: req.isLoggedIn})
})

app.get("/courses", verifyToken, (req, res) => {
    res.render("courses", {user: req.isLoggedIn})
})

app.get("/signUp", verifyToken, (req, res) => {
    if(typeof(req.isLoggedIn) == 'undefined'){
        res.render('signUp');
    }
    console.log(req.isLoggedIn);
    res.redirect('/');
})

app.post("/signUp", async(req, res)=>{
    //try{
        const email = req.body.email;
        const oldUser = await Register.findOne({email: email});

        if (oldUser) {
          res.status(409).send("User Already Exist. Please Login");
        }

        const password = req.body.password;
        const cpassword = req.body.password1;

        if(password === cpassword){
            const uniqueString = randString();
            console.log(uniqueString);
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                uniqueString: uniqueString
            })

         

        const validated = await user.save();

        sendMail(req.body.email, uniqueString);
        res.render("error", {message: "Check mail to verify!"});
        
        }
        
        else{
            res.send("password are not matching");
        } 
    
    //} 

})

app.get("/logIn", verifyToken, (req, res) => {
    if(typeof(req.isLoggedIn) == 'undefined'){
        res.render('logIn');
    }
    console.log(req.isLoggedIn);
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})


app.get("/videos", verifyToken,(req, res) => {
    res.render("videos", {user: req.isLoggedIn});
});

app.post('/logIn', async(req, res) => {
    //try {

        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email});
        //const user_id = useremail.id;
        //console.log(useremail);
        
        if(useremail.password === password){
            
            jwt.sign({id: useremail.id, username: useremail.username, email: useremail.email}, process.env.TOKEN_KEY,{
                expiresIn: "5h",
            }, (err, token) => {
                res.cookie('token', token, {httpOnly: true});
                res.redirect('/')
            });
        
        } else{
            res.send("invalid login details");
        }

    /*}catch(err){
        res.status(400).send(err);
    }
    */
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

app.get("/join", verifyToken, (req, res) => {
    res.render("join", {user: req.isLoggedIn})
});

app.post("/sharevideo", async (req, res) => {
        const videoshare = new video({
            email: req.body.email,
            subject: req.body.subject,
            link: req.body.link
        })

        const videoshared = await videoshare.save();
        res.status(201).render("videos");

})

app.post("/accessnote", verifyToken, async (req, res) => {
    if(typeof(req.isLoggedIn) == 'undefined'){
        res.sendStatus(403);
    }

    const subject = req.body.subject;

    if(subject){
        const subjectaccess = await userNote.find({ subject: subject});
        res.render("access", {subjectaccess : subjectaccess, user: req.isLoggedIn});
    }
    else{
        res.send("No subject");
    }
});

app.post("/accessvideos", verifyToken, async(req, res) => {
    const subject = req.body.subject;

    if(subject){
        const subjectaccess = await video.find({ subject: subject});
        res.render("videoaccess", {subjectaccess : subjectaccess, user: req.isLoggedIn});
    }
    else{
        res.send("No subject");
    }
})

app.post("/join", async (req, res) => {
    const Addmentor = new addMentor({
        img: req.body.img,
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message

    })

    const addedMentor = await Addmentor.save();
    
    res.redirect("/");
});
app.get("/contact",verifyToken, async (req, res) => {
    const addmentor = await addMentor.find({});
    res.render("contact", {addmentor : addmentor, user: req.isLoggedIn});
})

app.get("/approve", async (req, res) => {
    const mentors = await addMentor.find({isApproved: false});
    res.render("display_msg", {mentors: mentors});

});

app.post("/approve", async (req, res) => {
    console.log(req.body);
    await addMentor.findByIdAndUpdate(req.body.id, {isApproved: true});

   /* const mentor = new joinUser({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    })

    const id = req.body.id;
    const addMentor = await mentor.save();
    */
    
    /*addMentor.deleteOne({id: id}, function (err, results) {
        if(err)
        console.log(err);
        else
        console.log(results);
    });*/

    
    res.redirect("/approve");
})


app.listen(8080, ()=>{
    console.log("Server started..")
});