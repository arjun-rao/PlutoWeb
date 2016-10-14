var express = require('express');
var router = express.Router();

var bluemix = require('../config/bluemix');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');

var alchemy_language = watson.alchemy_language({
  api_key: 'e5c15cad20f0fdee05566005da27dbbbfd41d31a'
});


router.post('/analyze', function(req, res, next) {
	
	var parameters = {
		extract: 'entities,doc-emotion',
		sentiment: 1,

		maxRetrieve: 1,
		text : req.body.text
	};


	alchemy_language.combined(parameters, function (err, response) {
		if (err)
			return next(err);
		else
		{
			console.log(JSON.stringify(response, null, 2));
			res.send(JSON.stringify(response,null,2));
		}
	});
	
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
