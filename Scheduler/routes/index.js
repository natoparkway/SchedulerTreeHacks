var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	req.session.major = "Computer Science";
  res.render('index', { title: 'Express' });
});

router.get('/courses', function(req, res) {
	//res.send(req.session.major);
	res.render('sample', { major: req.session.major});
});

router.get('/major_info', function(req, res) {
	res.json(req.session.major);
});

module.exports = router;
