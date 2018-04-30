const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const auth = require('../auth');



const include = encodeURIComponent('data[*].created,answer_count,follower_count,author');
const url = 'https://www.zhihu.com/api/v4/members/hu-guo-ba-98/following-questions';
let limit = 100;
let offset = 0;
let question = [];

const questionMap = require('../data/question_cache.json');

function next () {
	request({
		url: `${url}?include=${include}&offset=${offset}&limit=${limit}`,
		headers: {
			authorization: auth.data
		}
	}, (err, res, data) => {
		data = JSON.parse(data);
		const list = data.data;
		console.log('offset: ', offset);
		offset += list.length;
		question = question.concat(list);

		if (data.paging.is_end || list.some((item) => {
			return !!questionMap[item.id];
		})) {
			const newQuestion = question.filter((item) => {
				return !questionMap[item.id];
			});
			console.log(newQuestion.length);

			question.forEach((item) => {
				questionMap[item.id] = true;
			});
			fs.writeFileSync('../data/question_cache.json', JSON.stringify(questionMap, null, 2), 'utf8');
			fs.writeFileSync('../data/question.json', JSON.stringify(newQuestion, null, 2), 'utf8');
			console.log('ok');
		} else {
			setTimeout(() => {
				next();
			}, 2000)
		}
	});
}
next();