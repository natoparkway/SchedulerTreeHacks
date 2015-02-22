var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Page1' });
});

router.get('/courses/:major', function(req, res) {
	res.render('old-classes-input', {title: 'Page2', major: req.params.major});
});

router.get('/data/major_info', function(req, res) {
	res.json(req.session.major);
});

module.exports = router;


//HOW TO REDIRECT
// router.post('/major', function(req, res) {
// 	res.redirect("/courses/" + req.body.major);
// });
