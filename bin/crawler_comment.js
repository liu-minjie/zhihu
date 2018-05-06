const fs = require('fs');
const path = require('path');
const request = require('request');
const async = require('async');
const auth = require('../auth');


function handleData(list) {
	return list.map((item) => {
		return {
			id: item.id,
			content: item.content,
			created_time: item.created_time,
			is_parent_author: item.is_parent_author,
			author: {
				name: item.author.member.name,
				url: item.author.member.url,
				gender: item.author.member.gender,
				url_token: item.author.member.url_token,
				avatar_url: item.author.member.avatar_url,
				id: item.author.member.id
			},
			reply_to_author: item.reply_to_author ?  {
				name: item.reply_to_author.member.name,
				url: item.reply_to_author.member.url,
				gender: item.reply_to_author.member.gender,
				url_token: item.reply_to_author.member.url_token,
				avatar_url: item.reply_to_author.member.avatar_url,
				id: item.reply_to_author.member.id
			} : null
		}
	})
}
module.exports = function (cid, cache, cb) {
	cache = cache || {};
	const include = encodeURIComponent('data[*].author,reply_to_author,content,is_parent_author');
	const url = `https://www.zhihu.com/api/v4/answers/${cid}/comments`;
	let limit = 20;
	let offset = 0;
	let comment = [];

	function next () {
		request({
			url: `${url}?include=${include}&offset=${offset}&limit=${limit}&order=created&status=open`,
			headers: {
				authorization: auth.data
			}
		}, (err, res, data) => {
			if (err) {
				console.log(err, 1);
				return cb(err);
			}

			try {
				data = JSON.parse(data);
				if (!comment.length && !data.data.length) {
					return cb(null, [], 0);
				}
			} catch (err) {
				return cb(er)
			}
			
			const list = handleData(data.data);
			console.log('offset: ', offset);
			offset += list.length;
			
			const end = list.some((item) => {
				return !!cache[item.id];
			});

			if (end) {
				comment = comment.concat(list.filter((item) => {
					return !cache[item.id]
				}));
			} else {
				comment = comment.concat(list)
			}

			if (data.paging.is_end || end || comment.length > 1000) {
				console.log(comment, data.paging.totals);
				cb(null, comment, data.paging.totals);
			} else {
				setTimeout(() => {
					next();
				}, 10)
			}
		});
	}
	next();
}