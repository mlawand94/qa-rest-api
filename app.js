'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');
var jsonParser = require("body-parser").json;



// var jsonCheck = function(req,res,next){
//     if(req.body){
//         console.log("The sky is ", req.body.color);
//     }else{
//         console.log("There is no body property on the request");
//     }
//     next();
// }
// app.use(jsonCheck);
app.use(jsonParser());
// app.use(jsonCheck);
app.use("/questions", routes);

var port = process.env.PORT || 3001;

app.listen(port, function(){
    console.log("Express server is now listening on port " + port);
});