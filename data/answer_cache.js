const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  const question = db.collection('question');
  const answerCache = db.collection('answer_cache');
  // const answer = db.collection('answer');

  const arr = [];
  question.find().toArray((err, qs) => {
    if (err) {
      process.exit();
    }
    async.eachSeries(qs, (q, next) => {
      const doc = {
        qid: q.id,
        cache: {}
      };
      const cache = doc.cache;
      answer.find({qid: q.id}).toArray((err, as) => {
        if (err) {
          console.log(err);
          console.log(q.id);
          return next();
        }
        as.forEach((item) => {
          cache[item.id] = true;
        });
        arr.push(doc);
        next()
      });
    }, (err) => {
      console.log('done', err);
      answerCache.insertMany(arr)
      .then((result) => {
      }).catch((err) => {
        console.log('dd', err);
      });
    })
  }) 
});