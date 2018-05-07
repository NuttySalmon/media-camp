var express = require("express");
var router  = express.Router({mergeParams: true});
var Entry = require("../models/entry");
var Review = require("../models/review");
var middleware = require("../middleware");

//reviews New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find entry by id
    console.log(req.params.id);
    Entry.findById(req.params.id, function(err, entry){
        if(err){
            console.log(err);
        } else {
             res.render("reviews/new", {entry: entry});
        }
    })
});

//reviews Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup entry using ID
   Entry.findById(req.params.id, function(err, entry){
       if(err){
           console.log(err);
           res.redirect("/entries/search");
       } else {
        var newReview={
          rating: req.body.rating,
          comment: req.body.comment,
          entry_id:req.params.id
        }

        Review.create(newReview, function(err, review){
           if(err){
               console.log(err);
           } else {
               //add username and id to review
               review.author.id = req.user._id;
               review.author.username = req.user.username;
               //save review
               review.save();
               console.log(entry._id);
               entry.reviewList.push(review);
               entry.save();
               console.log(review);
               req.flash('success', 'Created a review!');
               res.redirect('/entries/display/' + entry._id);
           }
        });
       }
   });
});

router.get("/:reviewId/edit", middleware.isLoggedIn, function(req, res){
    // find entry by id
    Review.findById(req.params.reviewId, function(err, review){
        if(err){
            console.log(err);
        } else {
             res.render("review/edit", {entry_id: req.params.id, review: review});
        }
    })
});

router.put("/:reviewId", function(req, res){
   Review.findByIdAndUpdate(req.params.reviewId, req.body.review, function(err, review){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/entries/" + req.params.id);
       }
   }); 
});

router.delete("/:reviewId",middleware.checkUserReview, function(req, res){
    Review.findByIdAndRemove(req.params.reviewId, function(err, review){
        if(err){
            console.log(err);
        } else {
            Entry.findByIdAndUpdate(req.params.id, {
              $pull: {
                reviews: review.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Review deleted!');
                res.redirect("/entries/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;