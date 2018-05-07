var express = require("express");
var router  = express.Router({mergeParams: true});
var Type = require("../models/type");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
	
	Type.find({}, function(err, allTypes){
	     if(err){
	         console.log(err);
	     } else {
	        if(req.xhr) {
	          res.json(allTypes);
	        } else {
	        	var typeNames = [];
	        	for(var i in allTypes){
	        		typeNames[i]=allTypes[i].name;
	        	}
	        	res.render("entries/new",{Type: typeNames});
	          	//console.log(typeNames);
	        }
	     }
	 }).sort(
    { 
        "name" : 1.0
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
	
  	var typeName = req.body.type.toLowerCase();
  	//console.log(typeName.toLowerCase());
	Type.findOne({"name":typeName}, function(err, typeEntry){
	     if(err){
	         console.log(err);
	     } else {
	        if(req.xhr) {
	          res.json(typeEntry);
	        } else {
	        	console.log(typeEntry.name);
	        	res.render("entries/new-details",{typeName:typeName, fieldList: typeEntry.fieldList});
	        }
	     }
 	});
});

module.exports = router;