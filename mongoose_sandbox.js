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
		size:  	{type: String, default: "golden"},
		mass:  	{type: Number, default: 0.004},
		name:  	{type: String, default: "Angela"},
	});
    var Animal = mongoose.model("Animal", AnimalSchema);

    var elephant = new Animal({
        type: "elephant",
        size: "big",
        color: "black",
        mass: 1000,
        name: "Lawrence"
    });


// Now we can generate a generic object of our model by passing an empty object into it. 
    var animal = new Animal({}); // Goldfish    

    // elephant.save(function(err){
    //     if (err) console.log("Save Failed!");
    //     else console.log("Saved!");
    //     db.close(function(){
    //         console.log("DB Connection closed!")
    //     });
    // });
    Animal.remove({}, function(){
        elephant.save(function(err){
            if (err) console.log("Save Failed!", err);
            animal.save(function(err){
                if (err) console.error("Save Failed!", err);
                // Ask the database for big animals
                Animal.find({size: "big"}, function(err, animals){
                    animals.forEach(function(animal){
                        console.log(animal.name + " the " + animal.color + " " + animal.type);
                        db.close(function(){
                            console.log("DB Connection Closed!");
                        });
                    });
                });                
            });
        });
    });
    // db.close();
});