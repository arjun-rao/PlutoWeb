var express = require('express');
var router = express.Router();

var bluemix = require('../config/bluemix');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');


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

router.post('/post', function(req,res,next) {
	var req_user_id = req.body.user_id;
	var text = req.body.payload;
	var req_day = req.body.day;
	var req_month = req.body.month;
	var req_year = req.body.year;

	console.log(req.body);

	//mongoose.connect('mongodb://localhost:27017/icare');
	// if our user.js file is at app/models/user.js
	var diaryEntry = require('../models/diaryEntry.js');
	// create a new user called chris
	var entry = new diaryEntry({
	  user_id: req_user_id,
	  date: {
		  day: req_day,
		  month: req_month,
		  year: req_year
	  },
	  body: text
	});

	entry.save(function(err) {
  		if (err) {
  			console.log(err);
  			res.status(500).json({status:"db save failed",user:req_user_id,body:text});
  			throw err;
  		}
		console.log('Entry saved successfully!');
		res.status(200).json({status:"ok",user:req_user_id,body:text,date:req_date+' '+req_month+' '+req_year});
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
