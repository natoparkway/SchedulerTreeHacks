var express = require('express');
var router = express.Router();

var test = [];

/* GET home page. */
router.get('/', function(req, res) {
	req.session.major = "Computer Science";
  res.render('index', { title: 'Page1' });
});

router.get('/courses', function(req, res) {
	res.render('sample', {title: 'Page2', major: req.session.major});
});

router.get('/schedule', function(req, res) {
	res.render('scheduling', {title: 'Schedule'});
});

router.get('/data/major_info', function(req, res) {
	res.json(req.session.major);
});



module.exports = router;
