const async = require('async');
const fs = require('fs');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const auth = require('../auth');

const download = function(uri, filename, callback){
  request({
  	url: uri
  }).pipe(fs.createWriteStream(filename)).on('close', callback);
};


const users = require('./users.json');
async.eachSeries(users, (user, next) => {
	download(user.avatar_url, `../public/img/user/${user.id}`, (err) => {
		if (err) {
			console.log(doc.id, err);
			return next();
		}
		setTimeout(() => {
			console.log(user.name);
			next();
		}, 1000);
	});
}, (err) => {
	console.log('done', err);
});
