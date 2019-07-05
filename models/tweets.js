var mongoose = require('mongoose');


var TweetSchema = new mongoose.Schema({
    time_date: Date,
    text: String,
    source: String,
    geo: String,
    topic: String,
    user: {
        id: String,
        name: String,
        screen_name: String,
        location: String,
        followers_count: Number,
        friends_count: Number,
        lang: String
    },
    sentiment: {
        score: Number,
        comparative: Number,
        tokens: [String],
        words: [String],
        positive: [String],
        negative: [String]
    }
});


module.exports = mongoose.model('Tweet', TweetSchema);