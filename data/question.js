const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  const question = db.collection('question');
  

  //const questions = require('./question.json');
  question.insertMany(questions.map((item) => {
    return {
      url: item.url,
      created: item.created,
      answer_count: item.answer_count,
      title: item.title,
      id: item.id,
      author: {
        name: item.author.name,
        url: item.author.url,
        gender: item.author.gender,
        url_token: item.author.url_token,
        avatar_url: item.author.avatar_url,
        id: item.author.id
      }
    }
  }))
  .then((result) => {
  }).catch((err) => {
    console.log(err);
  });

/*
  const cache = {};
  question.find({}).toArray((err, docs) => {
    async.eachSeries(docs, (doc, next) => {
      if (cache[doc.id]) {
        return next();
      }
      question.find({
        id: doc.id
      }).toArray((err, data) => {
        cache[doc.id] = true;
        console.log(data.length);
        if (data.length > 1) {
          data = data.slice(1);
          async.eachSeries(data, (d, cb) => {
            question.deleteOne({
              _id: d._id
            }).then(() => {
              cb();
            });
          }, (err) => {
            next(err);
          });
        } else {
          next();
        }
      })
    }, (err) => {
      console.log('done', err);
    })
  })
  */

  
});