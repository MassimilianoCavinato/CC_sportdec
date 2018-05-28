"use strict";
const githubAPI = require('./githubAPI');
const twitterAPI = require('./twitterAPI');

module.exports = {

    parseArgv: function(){

        //just parsing optional arguments that might be or not be passed when the script is invoked

        let keyword = process.argv[2] || "Football";
        let page = parseInt(process.argv[3]) || 1;
        let per_page =  parseInt(process.argv[4]) || 10;

        if(per_page < 1 || per_page > 10){ per_page = 10;}
        if(page*per_page > 1000){page = 1;} //searching more than 1000 results will throw an error and dryout the remining APIs

        let result = {
            keyword: keyword,
            page: page,
            per_page: per_page
        };
        // console.log(result);
        return result;
    },

    CC_sportdec: function(keyword, page, per_page){

        return githubAPI.getRateLimit().then((res) => {
            if(this.githubRateLimit_OK(res, per_page)){
                return githubAPI.getReposByKeyword(keyword, page, per_page).then((res) => {
                    let repoItems = JSON.parse(res.body).items || [];
                    //The fastest way to reduce response time: tonitiate the 2 promises: summary and tweets, then..
                    //once both are resolved (resolving in parallel) use map to assign results to each repo leveraging on the index,
                    //there are no push or pops therefore I can assume that it will work 100%
                    let summaries = this.getListOfSummaries(repoItems);
                    let tweets = this.getListOfTweets(repoItems);
                    //The most expensive computation is getting the readme,
                    //tested with 20 repos and worst result to resolve both promises was 898 ms from home connection
                    return Promise.all([summaries, tweets]).then((res) => {
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
            return res; //if githubRateLimit_OK is false;
        }).catch((err) => {
            return err;
        });

        //
        // console.log(githubRateLimit_OK);


    },
    githubRateLimit_OK: function(res, per_page){
        //Github rate limit api doesn't affect the remaining API counter, however,
        //before messing up with unwanted responses I think it is beneficial to make
        //some simple checks:
        // 1) I want to make sure I have reached the github endpoint in the previous call
        // 2) I want to make sure I have at least 1 search API left to perform the first search
        // 3) I want to make sure I have enough core APIs to fetch the README files later on
        let search_remaining = JSON.parse(res.body).resources.search.remaining > 0 || 0; //something unexpected?
        let core_remaining = JSON.parse(res.body).resources.core.remaining || 0; //something unexpected?
        console.log('search_remaining', search_remaining > 0);
        console.log('core_remaining', core_remaining >= per_page);
        return res.statusCode === 200 && search_remaining > 0 && core_remaining >= per_page; //boolean
    },
    getListOfSummaries: async function(repoItems){

        let start = Date.now();
        let summaries = repoItems.map((repo) => {
            return githubAPI.getRepoSummary(repo.owner.login, repo.name);
            // .then((res) => {
            //     console.log("summary ok", repo.name, (Date.now() - start), "ms");
            //     return JSON.parse(res.response.body);
            // })
            // .catch((err) => {
            //     console.log("summary error", repo.name, (Date.now() - start), "ms");
            //     return "";
            // });
        });

        return Promise.all(summaries);
    },
    getListOfTweets: async function(repoItems){

        let start = Date.now();
        let tweets = repoItems.map((repo) => {
            let question = repo.owner.login+'/'+repo.name;
            return twitterAPI.getTweets(question);
            // .then((res) => {
            //     console.log("tweets ok", repo.owner.login, repo.name, (Date.now() - start), "ms");
            //     return res.statuses;
            // })
            // .catch((err) => {
            //     console.log("tweets error", repo.owner.login, repo.name,  (Date.now() - start), "ms");
            //     return [];
            // });
        });
        console.log(tweets);
        return Promise.all(tweets);
    }
}
