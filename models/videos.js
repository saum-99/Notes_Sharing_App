const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    link : {
        type: String
    }
});

const Video = new mongoose.model("Video", videoSchema);

module.exports = Video;