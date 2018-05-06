const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  const user = db.collection('user');
  // const users = require('./users.json');

  user.insertMany(users.map((item) => {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      gender: item.gender,
      avatar_url: item.avatar_url,
      badge: item.badge.length && item.badge[0].topics ? item.badge[0].topics.map((item) => {
        return item.name
      }).join(',')  : ''
    }
  }))
  .then((result) => {
    console.log(result);
  }).catch((err) => {
    console.log(err);
  });
});