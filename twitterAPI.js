"use strict";

const Twitter = require('twitter');
const TwitterClient = new Twitter({
  consumer_key:  process.env.TWITTER_API_KEY,
  consumer_secret:  process.env.TWITTER_API_SECRET,
  access_token_key:  process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = {

  getTweets: function(question){

    encodeURI(question);
    return TwitterClient.get('search/tweets.json', {
        q: question,
        lang: 'eu',
    });
  }
}
