'use strict';

var express = require('express');
var app = express();

var port = process.env.PORT || 3001;

app.listen(port, function(){
    console.log("Express server is now listening on port " + port);
});