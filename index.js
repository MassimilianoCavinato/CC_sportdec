"use strict";
require('dotenv').config();
var server = require('./server');
var mashupAPI = require('./mashupAPI');
var argvParser = require('minimist')(process.argv.slice(2));
var argv = mashupAPI.parseArgv(argvParser);


// mashupAPI.CC_sportdec(argv.keyword, argv.page, argv.per_page).then((resolve) => {
//     console.log(resolve);
// }).catch((err) => {
//     console.log(err);
// });

server.get('/CC_sportdec', (req, res) => {
    mashupAPI.CC_sportdec(argv.keyword, argv.page, argv.per_page).then((resolve) => {
        res.send(resolve);
    }).catch((err) => {
        res.send(err);
    });
});

////////////////////// IMPORTANT //////////////////////
//   ensure .env file exists with the following config:
//
//   TWITTER_API_KEY=xxx
//   TWITTER_API_SECRET=xxx
//   TWITTER_ACCESS_TOKEN=xxx
//   TWITTER_ACCESS_TOKEN_SECRET=xxx
//
///////////////////////////////////////////////////////
