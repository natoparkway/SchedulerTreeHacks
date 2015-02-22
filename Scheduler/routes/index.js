var express = require('express');
var router = express.Router();
var Entry = require('../models/course.js');

var test = [
	{ 
		titleCode: "CS 106A",
		quarter: false,
		databaseId: 1
	}, {
		titleCode: "CS 106B",
		quarter: "winter1",
		databaseId: 2
	}, {
		titleCode: "MATH 52",
		quarter: false,
		databaseId: 3
	}];

var temp;

var requirementsJSON;

var fs = require('fs');
fs.readFile('data/MajorReqs.json', 'utf8', function (error, data) {
	if (error) {
		throw error;
	}
	requirementsJSON = data;
});

router.get('/data/schedule/', function(req, res) {
	res.send({data:test});
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Page1' });
});

router.get('/courses', function(req, res) {
	res.render('pick-classes-view', {title: 'Page2'});
});

router.get('/schedule', function(req, res) {
	res.render('scheduling', {title: 'Schedule'});
});

router.get('/data/major_info', function(req, res) {
	res.json(req.session.major);
});

router.get('/data/requirements', function(req, res) {
	res.json(requirementsJSON);
});

router.get('/data/classes/:course', function(req, res){
	/* Gets the subject and code of the course */
	var index = req.params.course.indexOf(" ");
	var subject = req.params.course.substring(0, index);
	var code = req.params.course.substring(index + 1);

	var result;
	var query = Entry.where({'subject': subject, 'code': code});

	query.findOne(function(error, myclass){
		if(error) throw error;
	
		/* If the class exists */
		if(myclass) {
			res.write({data: myclass});
			return;
		}
	});
	res.end();
});



module.exports = router;


//HOW TO REDIRECT
// router.post('/major', function(req, res) {
// 	res.redirect("/courses/" + req.body.major);
// });
