"use strict";
const rp = require('request-promise');

module.exports = {

    //search request limit : 10 req/minute
    //not authenticated core request limit: 60 req/hour

    userAgent: 'CC_sportedec',

    getRateLimit: function(){

        let url = "https://api.github.com/rate_limit";
        let options = {
            method: 'GET',
            url: url,
            headers: {
                'User-agent': this.userAgent,
                'Accept': 'application/vnd.github.v3.object'
            },
            resolveWithFullResponse: true
        }

        return rp(options)
    },

    getReposByKeyword: function(keyword, page, per_page){

          let url =  encodeURI("https://api.github.com/search/repositories?q="+keyword+"&sort=stars&order=desc&page="+page+"&per_page="+per_page);
          let options = {
                method: 'GET',
                url: url,
                headers: {
                    'User-agent': this.userAgent,
                    'Accept': 'application/vnd.github.v3.object'
                },
                resolveWithFullResponse: true
          }
          return rp(options);
    },

    getRepoSummary: function(owner, repo){

        let url = encodeURI("https://api.github.com/repos/"+owner+"/"+repo+"/readme");
        let options = {
            method: 'GET',
            url: "https://api.github.com/repos/"+owner+"/"+repo+"/readme",
            headers: {
                'User-agent': this.userAgent,
                'Accept': 'application/vnd.github.v3.html'
            },
            resolveWithFullResponse: true
        }
        return rp(options);
    },


    getNetworkEventsByProject: function(owner, repo){

        //I made this function because I saw a link to the docs of this API when I was reading the code challange,
        //I imagine that this was provided to search the readme file through all the commits of a specific repo,
        //however github is already providing a "readme api" that gives the preferred README.md in the response.
        //Iterating through all events using this API and find the location of the README.md is possible
        //but it is a bit overkilling considering that there is a dedicated official method for that.

        let url = encodeURI("https://api.github.com/networks/"+owner+"/"+repo+"/events");
        let options = {
            method: 'GET',
            url: url,
            headers: {
                'User-agent': this.userAgent,
                'Accept': 'application/vnd.github.v3.html'
            },
            headers: { 'User-agent': this.userAgent }
        }
        return rp(options);
    },
}
