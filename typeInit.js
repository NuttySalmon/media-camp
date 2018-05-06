var mongoose = require("mongoose");
var Type = require("./models/type");

var data = [
    {
        name: "Movie",
        fields: ["Year", "Director", "Writers", "Stars", "Length"] 
    },
    {
        name: "Game", 
        fields: ["Year", "Publisher", "Platform"] 
    },
    {
        name: "Show", 
        fields: ["Year", "No. of seasons", "Writer(s)", "No. of pages", "Stars", "Creators"] 
    },
    {
        name: "Book", 
        fields: ["Author", ""] 
    },

];

function typeInit(){
   //Remove all types
   Type.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed all type objects");
         //initialze types
        data.forEach(function(seed){
            Type.create(seed, function(err, type){
                if(err){
                    console.log(err)
                } else {
                    console.log("added ", type.name);
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = field-init;