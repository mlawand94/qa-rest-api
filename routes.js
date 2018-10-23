'use strict';

var express = require('express');
var router = express.Router();
var Question = require("./models").Question;

/* 
    Param Methods 
*/
// Document will be present on any matching route
// This callback is executed when qID is present. 
router.params('/:qID', function(req, res, next, id){
    Question.findById(req.params.qID, function(err, doc){
        if(err) return next(err);
        // doc can't be found, return 404 error to client. 
        if(!doc){
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        // If it exists, set it to the route object so that 
        // it can be used in other middleware and route handlers that receive this request.
        req.question = doc;
        // To trigger the next middleware. 
        return next();
    });
});

/* 
    Pre-load answer documents 
*/
router.param("aID", function(req, res, next, id){
    // Mongoose has a special method for sub-documents in arrays called id. 
    // id() takes an id of a subdoc and returns a subdoc with that matching ID.
    req.answer = req.question.answers.id(id);
    if(!req.answer){
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
    }
    next();
});

/* 
    Route Handlers
*/

//GET /questions
// Route for questions collection
router.get("/", function(req, res, next){
    // Question.find({}, null, {sort: {createdAt: -1}}, function(err, questions){
    //     if(err) return next(err);
    //     return res.json(questions);
    // });

    // Query builder
    Question.find({})
    .sort({createdAt: -1})
    .exec(function(err, questions){
        if (err) return next(err);
        return res.json(question);
    });

    // Return all the questions
    // res.json({response: "You sent me a GET request"});
});

//POST /questions
// Route for creating questions
router.post("/", function(req, res, next){
    var question = new Question(req.body);
    question.save(function(err, question){
        if (err) return next(err);
        res.status(201);
        res.json(question);
    });
    // res.json(
    //     {
    //         response: "You sent me a POST request",
    //         body: req.body
    //     }
    // );
});

//GET /questions/:id
// Route for specific questions
router.get("/:qID", function(req, res, next){
    res.json(req.question);
});

//POST /questions/:id/answers
// Route for creating an answer
router.post("/:qID/answers", function(req, res, next){
    req.question.answers.push(req.body);
    req.question.save(function(err, question){
        if (err) return next(err);
        res.status = 201;
        return res.json(question);
    });
    // res.json({response: "You sent me a POST request to /answers",questionId: req.params.qID,body: req.body});
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res){
    // req.body has the values we want to modify in our document. 
    // Callback to fire after saving updates to db. 
    req.answer.update(req.body, function(err, result){
        if(err) return next(err);
        res.json(result);
    });
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res){
    // Using the remove method on our callback
    req.answer.remove(function(err){
        // Save the parent question
        req.question.save(function(err, question){
            if(err) return next(err);
            res.json(question);
         });
    });
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/vote-down
// Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
    if(req.params.dir.search(/^(up|down)$/) === -1){
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }else{
        req.vote = req.params.dir;
        next();
    }

},function(req, res, next){
    req.answer.vote(req.vote, function(err, question){
        if(err) return next(err);
        res.json(question);
    });
});

module.exports = router;
