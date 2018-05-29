"use strict";
const githubAPI = require('./githubAPI');
const twitterAPI = require('./twitterAPI');
var jsonfile = require('jsonfile');

module.exports = {

    parseArgv: function(argv){

        // parsing optional arguments, defaults to:
        // -k, "Football" => keyword
        // -p, 1 => page
        // -c, 10 => per_page

        return {
            keyword: this.getKeyword(argv), // "Football"
            page: this.getPage(argv), // 1
            per_page: this.getPerPage(argv), //10
        }
    },
    getKeyword: function(argv){

        // get the -k option or "Football"
        let keyword = argv.k || 'Football';
        if(typeof keyword !== 'string'){
            keyword = 'Football';
        }
        return keyword;
    },
    getPage: function(argv){

        // get the -p option or 1
        let page = parseInt(argv.p, 10) || 1;
        if(typeof page !== 'number'){
            page = 1;
        }
        return page;
    },
    getPerPage: function(argv){

        // get the -c option or 10
        let per_page = parseInt(argv.c, 10) || 10;
        if(typeof per_page !== 'number'){
            per_page = 10;
        }
        return per_page;
    },
    CC_sportdec: function(keyword, page, per_page){

        //main controller
        twitterAPI.setAccessToken();

        return githubAPI.getRateLimit().then((res) => {

            if(this.githubRateLimit_OK(res, per_page)){

                return githubAPI.getReposByKeyword(keyword, page, per_page).then((res) => {
                    let repoItems = JSON.parse(res.body).items;

                    //The fastest way to reduce response time: tonitiate the 2 promises: summary and tweets, then..
                    //once both are resolved (resolving in parallel) use map to assign results to each repo leveraging on the index,
                    //there are no push or pops therefore I can assume that it will work 100%

                    let summaries = this.getListOfSummaries(repoItems);
                    let tweets = this.getListOfTweets(repoItems);

                    //The most expensive computation is getting the readme,
                    //tested with 20 repos and worst result to resolve both promises was 898 ms from home connection

                    return Promise.all([summaries, tweets]).then((res) => {
                        //zipping repos summaries and tweets
                        return repoItems.map((repo, index) => {
                            let summary =  res[0][index];
                            let tweets = res[1][index];
                            repo.summary = summary;
                            repo.tweets = tweets;
                            return repo;
                        });
                    }).catch((err) => err);
                    return res;
                }).catch((err) => err);
            }

            return res; //if githubRateLimit_OK === false;
        }).catch((err) => {
            return err;
        });
    },
    githubRateLimit_OK: function(res, per_page){

        // Github rate limit api doesn't affect the remaining API counter,

        // Doing 3 checks:
        // 1) I want to make sure I have reached the github endpoint in the previous call
        // 2) I want to make sure I have at least 1 search API left to run the repo search
        // 3) I want to make sure I have enough core APIs to fetch the README files later on

        let search_remaining = JSON.parse(res.body).resources.search.remaining > 0 || 0; //something unexpected?
        let core_remaining = JSON.parse(res.body).resources.core.remaining || 0; //something unexpected?

        // console.log('search_remaining', search_remaining > 0);
        // console.log('core_remaining', core_remaining >= per_page);

        return res.statusCode === 200 && search_remaining > 0 && core_remaining >= per_page; //boolean
    },
    getListOfSummaries: async function(repoItems){

        let start = Date.now();
        console.log("GET LIST OF SUMMARIES STARTED AT", start);
        let summaries = repoItems.map((repo) => {
            return githubAPI.getRepoSummary(repo.owner.login, repo.name).then((res) => {
                console.log("summary ok", repo.name, (Date.now() - start), "ms");
                return res.body;
            }).catch((err) => {
                console.log("summary error", repo.name, (Date.now() - start), "ms");
                return false;
                //doing this so that the front-end can do something like if(summary){...}else{...}
            });
        });

        return Promise.all(summaries);
    },
    getListOfTweets: async function(repoItems){

        let start = Date.now();
        console.log("GET LIST OF TWEETS___ STARTED AT", start);

        let tweets = repoItems.map((repo) => {
            let question = repo.owner.login+'/'+repo.name;
            return twitterAPI.getTweets(question).then((res) => {
                console.log("tweets ok", repo.owner.login, repo.name, (Date.now() - start), "ms");
                return res;
                //if api requests are finished this will be catched as an error
            })
            .catch((err) => {
                console.log("tweets error", repo.owner.login, repo.name,  (Date.now() - start), "ms");
                return false;
           });
        });

        return Promise.all(tweets);
    },

    saveOutput(output){
        //saving output help function
        jsonfile.writeFile('output.json', output, {spaces: 4},(err) => {
            if(err){
                console.log('Error while saving file');
            }else{
                console.log("Output saved to: output.json");
            }
        });

    }

}
