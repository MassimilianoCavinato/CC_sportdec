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

      //It is quite hard to get tweets about github small projects,
      //I tweeted about this repo from my own twitter account to test the functionality of this program.
      //I used hashtags, twittercards, normal comments and url links and yet I can't get my own tweets!.
      //It seems to work well on bigger repos like ExpressJs, NodeJs etc..
      //TwitterClient encodes query parameters by default.
      
        return TwitterClient.get('search/tweets.json', {
            q: question,
            count: 10,
            result_type: 'recent',
            include_entities: false
        });
    },
}
