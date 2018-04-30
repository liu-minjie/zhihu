
const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const moment = require('moment');
const auth = require('../auth');


const userMap = require('../data/users_cache.json');

const include = encodeURIComponent('data[*].answer_count,articles_count,gender,follower_count,is_followed,is_following,badge[?(type=best_answerer)].topics');
const url = 'https://www.zhihu.com/api/v4/members/hu-guo-ba-98/followees';
let limit = 100;
let offset = 0;
let users = [];

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
		users = users.concat(list);

		if (data.paging.is_end) {
			const newUser = users.filter((item) => {
				return !userMap[item.id];
			});

			users.forEach((item) => {
				userMap[item.id] = true;
			});
			fs.writeFileSync('../data/users_cache.json', JSON.stringify(userMap, null, 2), 'utf8');
			fs.writeFileSync('../data/users.json', JSON.stringify(newUser, null, 2), 'utf8');
			console.log('ok');
		} else {
			setTimeout(() => {
				next();
			}, 2000);
		}
	});
}
next();