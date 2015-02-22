var mongoose = require('mongoose');

//Schema for a post object
var courseSchema = mongoose.Schema({
	subject: String,
	code: String,
	title: String,
	description: String,
	terms: [String],
	times: [String]
});

//Make Model
var Course = mongoose.model('Course', courseSchema);	//Look for collection named 'course'

//Export Model
module.exports = Course;