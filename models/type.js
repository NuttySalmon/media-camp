var mongoose = require("mongoose");

var typeSchema = new mongoose.Schema({
	name: {type:String, unique: true, required: true},
	fieldList: [String]
});

module.exports = mongoose.model("Type", typeSchema);