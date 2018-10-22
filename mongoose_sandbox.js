'use strict';

var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/sandbox");

var db = mongoose.connection;
db.on("error", function(err){
    console.error("connection error:", err);
});

db.once("open", function(){
    console.log("db connection successful");

    var Schema = mongoose.Schema;
    // var AnimalSchema = new Schema({
    //     type: String,
    //     size: String,
    //     color: String,
    //     mass: Number,
    //     name: String
    // });
    var AnimalSchema = new Schema({
		type: 	{type: String, default: "goldfish"},
		color: 	{type: String, default: "small"},
		size:  	String,
		mass:  	{type: Number, default: 0.004},
		name:  	{type: String, default: "Angela"},
    });
    
    AnimalSchema.pre("save", function(next){
        if(this.mass >= 100){
            this.size = "big";
        }else if(this.mass >= 5 && this.mass < 100){
            this.size = "medium";
        }else{
            this.size = "small";
        }
        next();
    });
    // Find an animal, but find more animals with the same color. 
    // Use instance methods - they exist on all documents. 
    // Instance methods say this value points to instances of this document itself
    AnimalSchema.methods.findSameColor = function(){
        // this == document
        return this.model("Animal").find({color: this.color}, callback);
    }

    AnimalSchema.statics.findSize = function(size, callback){
        // this == Animal
        return this.find({size:size}, callback);
    }

    var Animal = mongoose.model("Animal", AnimalSchema);

    var elephant = new Animal({
        type: "elephant",
        color: "black",
        mass: 1000,
        name: "Lawrence"
    });
    var animalData = [
        {
            type: "mouse", 
            color: "gray",
            mass: 0.032, 
            name: "Marvin"
        },
        {
            type: "nurtiae", 
            color: "brown",
            mass: 6.699, 
            name: "Gretchen"
        },
        {
            type: "wolf", 
            color: "grat",
            mass: 5.32, 
            name: "Iris"
        },
        elephant, 
        animal        
    ];

// Now we can generate a generic object of our model by passing an empty object into it. 
    var animal = new Animal({}); // Goldfish    

    // elephant.save(function(err){
    //     if (err) console.log("Save Failed!");
    //     else console.log("Saved!");
    //     db.close(function(){
    //         console.log("DB Connection closed!")
    //     });
    // });




    Animal.remove({}, function(err){
        if (err) console.error(err);
            Animal.create(animalData, function(err, animals){
                if(err) console.err(err);
                Animal.findOne({type}, function(err, animals){
                // Animal.findSize("medium", function(err, animals){
                // Animal.find({}, function(err, animals){
                    animals.forEach(function(animal){
                        console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.");
                    });
                    db.close(function(){
                        console.log("DB Connection Closed!");
                    }); 
                });
            });                
        });
    });
    // db.close();
