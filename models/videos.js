const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    subject: {
        type: String
    },
    link : {
        type: String
    }
});

const Video = new mongoose.model("Video", videoSchema);

module.exports = Video;