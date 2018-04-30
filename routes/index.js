const config = require('../config');
const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const util = require('../util');
const userApi = require('../models/user');
const questionApi = require('../models/question');
const answerApi = require('../models/answer');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/user', function(req, res, next) {
	res.render('user', {
	});
});

router.get('/userList', function(req, res, next) {
	userApi.list(req.query.page || 0, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});


router.get('/question', function(req, res, next) {
	res.render('question', {
	});
});

router.get('/questionList', function(req, res, next) {
	questionApi.list(req.query.page || 0, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});


router.get('/answer', function(req, res, next) {
	res.render('answer', {
	});
});

router.get('/answerList', function(req, res, next) {
	answerApi.list(req.query.qid, req.query.page || 0, (err, list) => {
		if (err) {
			return res.send({
				success: false
			})
		}

		res.send({
			success: true,
			data: list
		})
	})
});


const download = function(uri, filename, callback){
	try {
		request({
	  	url: uri
	  }).on('error', callback).pipe(fs.createWriteStream(filename))
	  .on('close', callback)
	  .on('error', callback);
	} catch (err) {
		console.log(err.code);
		console.log(err.message);
		callback(err)		
	}
};


router.post('/answer/img', (req, res) => {
	const qid = req.body.qid;
	const aid = req.body.aid;
	const src = req.body.src;
	const uid = '' + qid + '_' + aid + '_' + Date.now()

	download(src, 'public/img/answer/' + uid, (err) => {
		if (err) {
			console.log(err.code);
			console.log(err.message);
			return res.send({
				success: false
			});
		}
		answerApi.updateImag(aid, src, uid, (err) => {
			res.send({
				success: !err,
				data: uid
			})
		})
	})
})



const itpub = require('./itpub');
/*

router.post('/itpub', (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	itpub.insert(JSON.parse(req.body.data), (err) => {
		res.send({
			success: !err
		})
	})
})
*/

router.get('/itpub', (req, res) => {
	res.render('itpub');
})

router.get('/api/itpub', (req, res) => {
	itpub.search(req.query.key, (err, data) => {
		res.send({
			success: !err,
			data: data
		});
	})
})


module.exports = router;