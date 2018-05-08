var mongoose = require("mongoose");

var recCommentSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    manRec: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
                ref: "ManRec",
                required: false
        },
        targetName: String,
        target_id: String
    },
    reason: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    entry_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry",
        required: true
    },

    target: {
        type: String,
        required: false
    }
    
    
});

module.exports = mongoose.model("RecComment", recCommentSchema);