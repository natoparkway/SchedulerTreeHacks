var mongoose = require('mongoose');

//Schema for a post object
var courseSchema = mongoose.Schema({
	subject: String, // CS, MATH, FRENLANG, etc.
	code: String, //106A, 107, etc.
	title: String, //PRINCIPLES OF COMPUTER SYSTEMS
	description: String, 
	terms: [String], //["autumn", "winter", "spring"]
	times: [String] //array of all times
	units: [Number]
});

//Make Model
var Course = mongoose.model('Course', courseSchema);

//Export Model
module.exports = Course;