var express = require("express");
var router  = express.Router();
var Title = require("../models/title");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all titles
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all titles from DB
      Title.find({name: regex}, function(err, allTitles){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allTitles);
         }
      });
  } else {
      // Get all titles from DB
      Title.find({}, function(err, allTitles){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allTitles);
            } else {
              res.render("titles/index",{titles: allTitles, page: 'titles'});
            }
         }
      });
  }
});

//CREATE - add new title to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to titles array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var cost = req.body.cost;
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newTitle = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
    // Create a new title and save to DB
    Title.create(newTitle, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to titles page
            console.log(newlyCreated);
            res.redirect("/titles");
        }
    });
  });
});

//NEW - show form to create new title
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("titles/new"); 
});

// SHOW - shows more info about one title
router.get("/:id", function(req, res){
    //find the title with provided ID
    Title.findById(req.params.id).populate("comments").exec(function(err, foundTitle){
        if(err){
          console.log(err);
        } else {
          console.log(foundTitle)
          //render show template with that title
          res.render("titles/show", {title: foundTitle});
        }
    });
});

router.get("/:id/edit", middleware.checkUserTitle, function(req, res){
    //find the title with provided ID
    Title.findById(req.params.id, function(err, foundTitle){
        if(err){
            console.log(err);
        } else {
            //render show template with that title
            res.render("titles/edit", {title: foundTitle});
        }
    });
});

router.put("/:id", function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Title.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, title){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/titles/" + title._id);
        }
    });
  });
});

router.delete("/:id", function(req, res) {
  Title.findByIdAndRemove(req.params.id, function(err, title) {
    Comment.remove({
      _id: {
        $in: title.comments
      }
    }, function(err, comments) {
      req.flash('error', title.name + ' deleted!');
      res.redirect('/titles');
    })
  });
});

module.exports = router;

