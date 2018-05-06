var mongoose = require("mongoose");

var recCommentSchema = mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    rec_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManRec",
        required: true
    },
    reason: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    
});

module.exports = mongoose.model("RecComment", recCommentSchema);