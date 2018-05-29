"use strict";
var rp = require('request-promise');

module.exports = {

    access_token: false,
    setAccessToken: async function(){

        let options = {
            method: 'POST',
            url: "https://api.twitter.com/oauth2/token/",
            headers:{
                'Authorization': 'Basic '+ Buffer.from(encodeURI(process.env.TWITTER_API_KEY)+':'+encodeURI(process.env.TWITTER_API_SECRET)).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: 'grant_type=client_credentials',
            json: true
        }
        let access_token = await rp(options).then((res) => {
            return res.access_token || false;
        }).catch((err) => {
            return false;
        });
        this.access_token = access_token;
    },
    getTweets: function(question){

        //It is quite hard to get tweets about github small projects,
        //I tweeted about this repo from my own twitter account to test the functionality of this program.
        //I used hashtags, twittercards, normal comments and url links and yet I can't get my own tweets!.
        //It seems to work well on bigger repos like ExpressJs, NodeJs etc..
        //TwitterClient encodes query parameters by default.

        if(this.access_token){
            question = encodeURI(question);
            let url =  encodeURI("https://api.twitter.com/1.1/search/tweets.json?q="+question+"&count=10&lang=eng&result_type=recent&include_entities=true");
            let options = {
                method: 'GET',
                url: url,
                headers:{
                    'Authorization': 'Bearer '+ this.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                json: true
            }
            return rp(options);
        }
        return false;
    },
}
