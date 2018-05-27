"use strict";
var server = require('./server');
var mashupAPI = require('./mashupAPI');
// ensure .env file exists with the following config:
//   GITHUB_CLIENT_ID=xxx
//   GITHUB_CLIENT_SECRET=xxx
//   TWITTER_API_KEY=xxx
//   TWITTER_API_SECRET=xxx
//   TWITTER_ACCESS_TOKEN=xxx
//   TWITTER_ACCESS_TOKEN_SECRET=xxx



server.get('/test', (req, res) => {
    let argv = mashupAPI.parseArgv();
    mashupAPI.test(argv.keyword, argv.page, argv.per_page).then((resolve) => {
      res.send(resolve);
    }).catch((err) => {
        res.send(err);
    });
});
