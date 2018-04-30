const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const moment = require('moment');
const mongoose = require('mongoose');
const auth = require('../auth');
//const questionApi = require('../models/question');





;(function () {
	const save = {};
	let questions = require('../data/question.json');
	questions = questions.slice(questions.findIndex((item) => { return item.id == '27325912'}))
	
	//console.log(questions.length);
	//return

	async.eachSeries(questions, (question, callback) => {
		console.log(question.id, question.title, question.answer_count);
		getAnswer(question.id, callback);
	}, (err) => {
		console.log(err, 'done');
	});



	function getAnswer (qid, next) {
		let more = true;
		const include = encodeURIComponent('data[*].annotation_action,annotation_detail,comment_count,content,editable_content,voteup_count,created_time,updated_time,review_info,excerpt;data[*].mark_infos[*].url;data[*].author.follower_count,badge[?(type=best_answerer)].topics');
		const url = `https://www.zhihu.com/api/v4/questions/${qid}/answers`;
		const limit = 100;
		let offset = 0;
		let answers = [];
		async.whilst(() => {
			return more;
		}, (callback) => {
			request({
				url: `${url}?include=${include}&offset=${offset}&limit=${limit}&sort_by=default`,
				headers: {
					authorization: auth.data
				}
			}, (err, res, data) => {
				try {
					data = JSON.parse(data);
				} catch (e) {
					console.log(data);
					process.exit(0);
					data = {
						data: [],
						paging: {
							is_end: true
						}
					}
				}
				
				offset += data.data.length;
				answers = answers.concat(data.data);
				if (data.paging.is_end || offset > 500) {
					more = false;
					fs.writeFileSync(`../data/answers/${qid}.json`, JSON.stringify(answers, null, 1), 'utf8');
				}
				callback();
			});
		}, (err) => {
			console.log(err, 'item done');
			next(err);
		})
	}
})();
