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
		
	//Watson Code Starts Here
	var watson_reply = '';
	var req_text = req.body.payload;
	var time = Date.now();
	var parameters = {
		extract: 'entities,doc-emotion',
		sentiment: 1,
		maxRetrieve: 1,
		text : req_text
	};


	alchemy_language.combined(parameters, function (err, response) {
		if (err)
		{
			console.log("Watson Died!");
			return next(err);
		}
		else
		{
			console.log(JSON.stringify(response, null, 2));
			watson_reply = JSON.stringify(response,null,2);
			//save everything to the local db
			var req_user_id = "default_web";					
			var diaryEntry = require('../models/diaryEntry.js');
			// create a new user called chris
			var entry = new diaryEntry({
			user_id: req_user_id,
			body: req_text,
			watson_response: watson_reply 
			});

			entry.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status:"db save failed",user:req_user_id});
					throw err;
				}
				console.log('Entry saved successfully!');
				res.send(watson_reply);
			});
		}
	});	
	
});

router.post('/post', function(req,res,next) {
	var req_user_id = req.body.user_id;
<<<<<<< HEAD
	var req_text = req.body.payload;
	var req_day = req.body.day;
	var req_month = req.body.month;
	var req_year = req.body.year;

	console.log(req.body);

	// if our user.js file is at app/models/user.js
	var diaryEntry = require('../models/diaryEntry.js');
	
	/*diaryEntry
	.findone({
			user_id:req_user_id,
			'date.day': req_day,
			'date.month': req_month,
			'date.year': req_year
	})
	.exec(function(err, existing_entry) {
		if ( err ) {
			console.log(err);
			throw err;
		}
		//existing entry for that day is found, stop registration
		if ( existing_entry ) {
			console.log("entry already exists");
			return;
		}
		console.log("entry created");
	});*/

	var entry = new diaryEntry({
			user_id: req_user_id,
			date: {
				day: req_day,
				month: req_month,
				year: req_year
			},
			body: req_text
		});

		entry.save(function(err) {
  		if (err) {
  			console.log(err);
  			res.status(500).json({status:"failed"});
  			return;
  		}
		console.log('Entry saved successfully!');
		res.status(200).json({status:"ok",user:req_user_id,date:''+req_day+'-'+req_month+'-'+req_year});
	});
=======
	var text = req.body.payload;
	var time = Date.now();
	
	//Watson Code Starts Here
	var watson_reply = '';
	var req_user_id = req.body.user_id;
	var req_text = req.body.payload;
	var time = Date.now();
	var parameters = {
		extract: 'entities,doc-emotion',
		sentiment: 1,
		maxRetrieve: 1,
		text : req_text
	};


	alchemy_language.combined(parameters, function (err, response) {
		if (err)
		{
			console.log("Watson Died!");
			return next(err);
		}
		else
		{
			console.log(JSON.stringify(response, null, 2));
			watson_reply = JSON.stringify(response,null,2);
			//save everything to the local db														
			var diaryEntry = require('../models/diaryEntry.js');
			// create a new user called chris
			var entry = new diaryEntry({
			user_id: req_user_id,
			body: req_text,
			watson_response: watson_reply 
			});

			entry.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status:"db save failed",user:req_user_id});
					throw err;
				}
				console.log('Entry saved successfully!');
				res.status(200).json({status:"ok",user:req_user_id});
			});
		}
	});	




>>>>>>> c7b9d9e0e5db6f1f7af91aedef958e772cb540a8
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;