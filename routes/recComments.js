var express = require("express");
var router  = express.Router({mergeParams: true});
var Entry = require("../models/entry");
var RecComment = require("../models/recComment");
var middleware = require("../middleware");


//reviews New
// router.get("/", function(req,res){
//   res.redirect("/entries/search");
// });

router.get("/new", middleware.isLoggedIn, function(req, res){
    
    console.log(req.params.id);
    Entry.findById(req.params.id, function(err, entry){
        if(err){
            console.log(err);
        } else {
             res.render("recComments/new", {entry: entry});
        }
    })
    // res.redirect("/entries/search");
});

//reviews Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup entry using ID
   Entry.findById(req.params.id, function(err, entry){
       if(err){
           console.log(err);
           res.redirect("/entries/search");
       } else {
        var newRecComment={
          target: req.body.target,
          entry_id:req.params.id
        }

        RecComment.create(newRecComment, function(err, recComment){
           if(err){
               console.log(err);
           } else {
               //add username and id to review
               recComment.author.id = req.user._id;
               recComment.author.username = req.user.username;
               //save review
               recComment.save();
               console.log(entry._id);
               entry.recCommentList.push(recComment);
               entry.save();
               console.log(recComment);
               req.flash('success', 'Created a recommendation!');
               return res.redirect('/entries/display/' + entry._id);
           }
        });
       }
   });
});

// router.get("/:reviewId/edit", middleware.isLoggedIn, function(req, res){
//     // find entry by id
//     Review.findById(req.params.reviewId, function(err, review){
//         if(err){
//             console.log(err);
//         } else {
//              res.render("review/edit", {entry_id: req.params.id, review: review});
//         }
//     })
// });

module.exports = router;