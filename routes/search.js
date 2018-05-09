var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");


//INDEX - show all entries
router.get("/", function(req, res) {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all entries from DB
        Entry.find({ name: regex }, function(err, allEntries) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(allEntries);
            }
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