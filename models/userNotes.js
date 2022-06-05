const mongoose = require('mongoose');

const userNotesSchema = new mongoose.Schema({
    email : {
        type:String,
        required:true,
    },

    subject : {
        type:String,
        required:true
    },

    link : {
        type: String,
        required: true
    }
});

const UserNote = new mongoose.model("UserNote", userNotesSchema);

module.exports = UserNote;