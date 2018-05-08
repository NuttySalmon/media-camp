var express = require("express");
var router = express.Router({ mergeParams: true });
var Entry = require("../models/entry");
var RecComment = require("../models/recComment");
var middleware = require("../middleware");
var ManRec = require("../models/manRec");

//reviews New
// router.get("/", function(req,res){
//   res.redirect("/entries/search");
// });

router.get("/new", middleware.isLoggedIn, function(req, res) {

    console.log(req.params.id);
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
            console.log(err);
        } else {
            res.render("recComments/new", { entry: entry });
        }
    })
    // res.redirect("/entries/search");
});

//reviews Create
router.post("/", middleware.isLoggedIn, function(req, res) {

    //lookup entry using ID
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
          console.log(err);
          res.redirect("/entries/search");
        } else {
          //lookup target
          Entry.findById(req.body.target_id, function(err, target) {
              if (err) {
                console.log(err);
                res.redirect("/entries/search");
              } else{
                ManRec.find({ recEntry_id: entry._id, targetEntry_id: target._id })
                    .exec(function(err, foundManRecList) {
                      var foundManRec;
                      if(err){
                        return console.log(err);
                      }
                      //if no manRec found


                      //console.log(foundManRec);
                      var newRecComment = {
                        entry_id: entry._id,
                        "manRec.targetName": target.name,
                        "manRec.target_id": target._id
                        //manRec:{id: foundManRec._id, targetName: target.name}

                      };

                      RecComment.create(newRecComment, function(err, recComment) {

                        if (err) {
                            console.log(err);
                        } else {
                            //add username and id to review
                            recComment.author.id = req.user._id;
                            recComment.author.username = req.user.username;
                            //save review
                            recComment.save();
                            console.log(entry._id);
                            entry.recCommentList.push(recComment);
                           // entry.save();

                            if(foundManRecList.length === 0){
                              
                              
                              //new manRec
                              newManRec={
                                recEntry_id: req.params.id, 
                                targetEntry_id: req.body.target_id 
                              }

                              ManRec.create(newManRec, function(err, newManRec){
                                  if(err){
                                    console.log(err);
                                  }

                                  recComment.manRec.id = newManRec.id;
                                  recComment.manRec.targetName = target.name;
                                  entry.manRecList.push(newManRec);
                                  entry.save();
                                  foundManRec = newManRec;
                                  foundManRec.count++;
                                  foundManRec.recCommentList.push(recComment);
                                  foundManRec.save();
                                  //console.log(recComment);
                                  req.flash('success', 'Created a recommendation!');
                                  console.log(foundManRec);
                                  return res.redirect('/entries/display/' + entry._id);
                                });
                              
                            } else{
                              entry.save();
                              foundManRec = foundManRecList[0];
                              foundManRec.count++;
                              foundManRec.recCommentList.push(recComment);
                              foundManRec.save();
                              //console.log(recComment);
                              req.flash('success', 'Created a recommendation!');
                              return res.redirect('/entries/display/' + entry._id);
                            }

                        }
                    });
                });
              };
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