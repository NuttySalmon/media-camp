var mongoose = require("mongoose");

var entrySchema = new mongoose.Schema({
   createdAt: { type: Date, default: Date.now },
   name: {type: String, required: true},
   type: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Type"
      },
      name: {
         type: String,
         required: true
      },
   },
   detailList:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Detail"
   }],
   image: {type: String, required: true},
   genre: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   rating: {type: Number, min: 0, max: 5},
   commentsList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
   }],
   manRecList:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: "ManRec"
   }],
   recCommentList:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RecComment"
   }]
   
});

module.exports = mongoose.model("Entry", entrySchema);