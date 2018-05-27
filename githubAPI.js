"use strict";
const rp = require('request-promise');

module.exports = {

    //not authenticated request limit : 10 req/minute

    userAgent: 'CC_sportedec',
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,

    getRateLimit: function(){
      let options = {
            method: 'GET',
            url: "https://api.github.com/rate_limit",
            headers: {
                'User-agent': this.userAgent,
                'Accept': 'application/vnd.github.v3.object'
            },
            resolveWithFullResponse: true
      }
      return rp(options).then((res) => {
        return res;
      });
    },

    getReposByKeyword: function(keyword, page, per_page){
          encodeURI(keyword);
          encodeURI(page);
          encodeURI(per_page);
          let options = {
                method: 'GET',
                url: "https://api.github.com/search/repositories?q="+keyword+"&sort=stars&order=desc&page="+page+"&per_page="+per_page,
                headers: {
                    'User-agent': this.userAgent,
                    'Accept': 'application/vnd.github.v3.object'
                },
                resolveWithFullResponse: true
          }
          return rp(options);
    },

    getRepoSummary: function(owner, repo){
        encodeURI(owner);
        encodeURI(repo);
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

    getNetworkEventsByProject: function(project){
        encodeURI(project); // "owner/repo"
        let options = {
            method: 'GET',
            url: "https://api.github.com/networks/"+project+"/events",
            headers: {
                'User-agent': this.userAgent,
                'Accept': 'application/vnd.github.v3.html'
            },
            headers: { 'User-agent': this.userAgent }
        }
    },
}
