var mongoose = require("mongoose");
var Type = require("./models/type");

var data = [
    {
        name: "movie",
        fieldList: ["year", "director", "writers", "stars", "length"] 
    },
    {
        name: "game", 
        fieldList: ["year", "publisher", "platform"] 
    },
    {
        name: "show", 
        fieldList: ["year", "no. of seasons", "writers", "no. of pages", "stars", "creators"] 
    },
    {
        name: "book", 
        fieldList: ["author", "no. of page", "iSBN", "edition"] 
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
                    console.log(err);
                } else {
                    console.log("added ", type.name);
                }
            });
        });
    }); 
    //add a few comments
}


module.exports = typeInit;