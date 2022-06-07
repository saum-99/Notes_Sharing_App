const nodemailer = require('node-mailer');

const transport = nodemailer.createTransport({
    service: "Gmail" ,
    auth: {
        user: "saumya.18245@knit.ac.in",
        pass: "29-Sa-19-Sh"
    }
});

const options = {
    from: "saumya.18245@knit.ac.in",
    to: "saumyash@gmail.com",
    subject: "Sending mail with nodejs",
    text: "wow!! that's simple" 
}

transport.sendMail(options, function(err, info) {
    if(err) {
        console.log(err); 
        return;
    }
    console.log("Sent" + info.response)
});