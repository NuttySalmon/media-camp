var mongoose = require("mongoose");

var typeSchema = new mongoose.Schema({
	name: String,
	fieldList: [String]
});

module.exports = mongoose.model("Type", typeSchema);