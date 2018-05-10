var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");
var Detail = require("../models/detail")

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all entries
router.get("/", function(req, res) {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all entries from DB
        Entry.find({ name: regex })
            .exec(function(err, allEntries) {
            if (err) {
                return console.log(err);
            } 
            Detail.find({content: regex})
            .populate("entry_id")
            .exec(function(err, allDetails){
                for(let detail of allDetails){
                    allEntries.push(detail.entry_id);
                }
                res.status(200).json(allEntries);
            });
    });
    } else {
        // Get all entries from DB
        Entry.find({}, function(err, allEntries) {
            if (err) {
                console.log(err);
            } else {
                if (req.xhr) {
                    res.json(allEntries);
                } else {
                    res.render("entries/index", { entries: allEntries, page: 'entries' });
                }
            }
        });
    }
});


module.exports = router;