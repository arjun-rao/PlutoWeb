var express = require('express');
var router = express.Router();

var bluemix = require('../config/bluemix');
var extend = require('util')._extend;
var watson = require('watson-developer-cloud');
var mongoose = require('mongoose');
var passport = require('passport');

var User = require('../models/user.js');


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
					res.status(500).json({status:"db save failed"});
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
	var req_text = req.body.payload;
	var req_day = req.body.day;
	var req_month = req.body.month;
	var req_year = req.body.year;
	

	// if our user.js file is at app/models/user.js
	var diaryEntry = require('../models/diaryEntry.js');
	
	
	
	//Watson Code Starts Here
	var watson_reply = '';	
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
			res.status(500).json({status:"Watson API failed"});
			return; 
		}
		else
		{
			console.log(JSON.stringify(response, null, 2));
			watson_reply = JSON.stringify(response,null,2);																				
			// create a new user called chris
			var entry = new diaryEntry({
				user_id: req_user_id,
				body: req_text,
				date: {
					day: req_day,
					month: req_month,
					year: req_year
				},
				watson_response: watson_reply 
				});

			entry.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status:"db save failed"});
					return;
				}
				console.log('Entry saved successfully!');
				res.status(200).json({status:"ok"});
			});
		}
	});	
});




router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json({
        status: 'Registration successful!'
      });
    });
  });
});

router.post('/login', function(req, res, next) {
	console.log("foundLogin " );
  passport.authenticate('local', function(err, user, info) {
    if (err) {
			console.log("CallBackError");
      return next(err);
    }
    if (!user) {
			console.log("InvalidUserError");
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
				console.log("InvalidLoginError");
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });


});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;