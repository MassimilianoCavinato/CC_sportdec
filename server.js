'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const server = express();

server.use(
    bodyParser.urlencoded({extended: true}),
    bodyParser.json()
)

server.listen(3000, function(){
    console.log("Node server listening on port", this.address().port);
})

module.exports = server;
