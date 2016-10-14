var express = require('express');
var router = express.Router();

var bluemix = require('../config/bluemix');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');

var credentials = extend({
	version : 'v1',
    "url": "https://gateway.watsonplatform.net/natural-language-classifier/api",
    "username": "8fa73cbf-7356-4a2c-8add-c762f2b262ab",
    "password": "lr0GCcnAQxYQ"
}, bluemix.getServiceCreds('natural_language_classifier')); 

var nlClassifier = watson.natural_language_classifier(credentials);
var classifierId = '2a3456x99-nlc-9921';

router.post('/predict', function(req, res, next) {
	var params = {
		classifier : classifierId,
		text : req.body.text
	};

	nlClassifier.classify(params, function(err, results) {
		if (err)
			return next(err);
		else
			res.json(results);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
