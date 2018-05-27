"use strict";
const githubAPI = require('./githubAPI');
const twitterAPI = require('./twitterAPI');

module.exports = {

    parseArgv: function(){

        let keyword = process.argv[2] || "Football";
        let page = parseInt(process.argv[3]) || 1;
        let per_page =  parseInt(process.argv[4]) || 10;
        if(per_page < 1 || per_page > 10){
            per_page = 10;
        }
        if(page*per_page > 1000){
            page = 1;
        }

        let result = {
            keyword: keyword,
            page: page,
            per_page: per_page
        };
        console.log(result);
        return result;
    },

    test: function(keyword, page, per_page){

        return githubAPI.getRateLimit().then((res) => {
            if(res.statusCode === 200){
                return githubAPI.getReposByKeyword(keyword, page, per_page).then((res) => {
                    let repoItems = JSON.parse(res.body).items;
                    return repoItems;
                    let summaries = this.getListOfSummaries(repoItems);
                    let tweets = this.getListOfTweets(repoItems);
                    return Promise.all([summaries, tweets]).then((res) => {
                        return repoItems.map((repo, index) => {
                            let summary =  res[0][index];
                            let tweets = res[1][index];
                            repo.summary = summary;
                            repo.tweets = tweets;
                            return repo;
                        });
                    });
                    return res;
                }).catch((err) => {
                    return err;
                });
            }
            return res;
        });
    },

    getListOfSummaries: async function(repoItems){
        let start = Date.now();
        let summaries = repoItems.map((repo) => {
            return githubAPI.getRepoSummary(repo.owner.login, repo.name)
            .then((res) => {
                console.log("summary ok", repo.name, (Date.now() - start), "ms", start);
                return res;
            })
            .catch((err) => {
                console.log("summary error", repo.name, (Date.now() - start), "ms", start);
                return {};
            });
        });
        return Promise.all(summaries);
    },

    getListOfTweets: async function(repoItems){
        var start = Date.now();
        let tweets = repoItems.map((repo) => {
            return twitterAPI.getTweets(repo.full_name)
            .then((res) => {
                console.log("tweets ok", repo.full_name, (Date.now() - start), "ms", start);
                return res.statuses;
            })
            .catch((err) => {
                console.log("tweets error", repo.full_name,  (Date.now() - start), "ms", start);
                return [];
            });
        });
        return Promise.all(tweets);
    }
}
