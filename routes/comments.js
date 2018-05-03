var express = require("express");
var router  = express.Router({mergeParams: true});
var Title = require("../models/title");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find title by id
    console.log(req.params.id);
    Title.findById(req.params.id, function(err, title){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {title: title});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup title using ID
   Title.findById(req.params.id, function(err, title){
       if(err){
           console.log(err);
           res.redirect("/titles");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               title.comments.push(comment);
               title.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/titles/' + title._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find title by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {title_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/titles/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Title.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/titles/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;