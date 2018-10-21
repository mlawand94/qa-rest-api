'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sortAnswers = function(a, b){
    // Return a negative if a should appear before b
    // 0 no change
    // + if a to be sorted after b

    if(a.votes === b.votes){
        return b.updatedAt - a.updatedAt;
    }
    return b.votes - a.votes;

}
// Answer document will be a subdocument of QuestionSchema
var AnswerSchema = new Schema({
    text: String, 
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    votes: {type: Number, default:0}
});

AnswerSchema.method("update", function(updates, callback){
    // Merge update in answer doc
    Object.assign(this, updates, {updatedAt: new Date()});
    this.parent().save(callback);
});

AnswerSchema.method("vote", function(votes, callback){
    if(vote === "up"){
        this.votes += 1;
    }else{
        this.votes -= 1;
    }
    this.parent().save(callback);
});

var QuestionSchema = new Schema({
    text: String, 
    createdAt: {type: Date, default: Date.now}, 
    answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next){
    this.answers.sort();
    next();
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;