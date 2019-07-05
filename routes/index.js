var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var Sentiment = require('sentiment');

//sentiment
var sentiment = new Sentiment();
//twitter
var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

var TweetModel = require('../models/tweets');

//SENTIMENT SETUP
var esLanguage = {
  labels: require('./es/labels.json')
};
sentiment.registerLanguage('es', esLanguage);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SentBall' });
});

router.post('/stream', function(req, res, next){
  var q = req.body.q;
  var lang = req.body.lang;
  console.log(q);
  var stream = client.stream('statuses/filter', {track: q, language: lang});
  stream.on('data', function(tweet){
    // console.log(tweet.extended_tweet);
    var tweet_text;
    var tweet_user;

    if (typeof tweet.extended_tweet === 'undefined'){
      tweet_text = tweet.text;
    } else {
      tweet_text = tweet.extended_tweet.full_text;
    }

    if (typeof tweet.user === 'undefined'){
      tweet_user = null;
    } else {
      tweet_user = tweet.user;
    }
    // console.log("Tweettext = " + tweet_text);

    var tweet_sentiment_analysis = sentiment.analyze(tweet_text, {language: lang});

    if(tweet_user !== null){
      var tweetDb = {
        time_date: tweet.created_at,
        text: tweet_text,
        source: tweet.source,
       // geo: tweet.geo,
        topic: q,
        user: {
            id: tweet_user.id,
            name: tweet_user.name,
            screen_name: tweet_user.screen_name,
            location: tweet_user.location,
            followers_count: tweet_user.followers_count,
            friends_count: tweet_user.friends_count,
            lang: tweet_user.lang
        },
        sentiment: tweet_sentiment_analysis
      }
      
      TweetModel.create(tweetDb, function(err, newlyCreated){
        if (err){
          console.log(err)
        } else {
          console.log("Agregado Tweet con el texto: \n ---------------------------\n" + tweet_text + "---------------------------\nA la base de datos. \n --------------------------- \n VALOR DE SENTIMIENTO: " + tweetDb.sentiment.score)
        }
      });
    }

    

    });
  
  stream.on('error', function(error) {
    throw error;
  });
  res.redirect('/')
});


module.exports = router;
