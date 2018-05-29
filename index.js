"use strict";
require('dotenv').config();
////////////////////// IMPORTANT //////////////////////
//   ensure .env file exists with the following config:
//   TWITTER_API_KEY=xxx
//   TWITTER_API_SECRET=xxx
///////////////////////////////////////////////////////
var server = require('./server');
var controllerAPI = require('./controllerAPI');
var argvParser = require('minimist')(process.argv.slice(2)); //just excluding file name and file path from process arguments
const argv = controllerAPI.parseArgv(argvParser);
server.get('/CC_sportdec', (req, res) => {
    controllerAPI.CC_sportdec(argv.keyword, argv.page, argv.per_page).then((resolve) => {
        res.send(resolve);
        controllerAPI.saveOutput(resolve);
    }).catch((err) => {
        res.send(err);
        controllerAPI.saveOutput(err);
    });
});







// //TEST
// controllerAPI.CC_sportdec(argv.keyword, argv.page, argv.per_page).then((resolve) => {
//     // console.log(resolve);
// }).catch((err) => {
//     // console.log(err);
// });
