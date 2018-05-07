var mongoose = require("mongoose");

var recCommentSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    rec_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManRec",
        required: false
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
        required: true
    }
    
    
});

module.exports = mongoose.model("RecComment", recCommentSchema);