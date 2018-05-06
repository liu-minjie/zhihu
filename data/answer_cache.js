const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  
  // const answerCache = db.collection('answer_cache');
  answerCache.aggregate([{
    $group : { 
      _id: "$qid" , count : { $sum: 1}, id: {$first: "$_id"}
    }
  }, {
    $match: { 
      count : { $gt : 1 } 
    }
  }], (err, list) => {
    async.eachSeries(list, (doc, next) => {
      answerCache.find({
        qid: doc._id
      }).toArray((err, res) => {
        if (err) {
          console.log(err);
          process.exit();
        }

        let max = -1;
        let id;
        res.forEach((item) => {
          const len = Object.keys(item.cache).length;
          if (len > max) {
            max = len;
            id = item._id;
          }
        });
        console.log(id);
        answerCache.remove({
          qid: doc._id,
          _id: {
            $ne: id
          }
        }, (err, doc) => {
          next(err)
        });
      });
    }, (err) => {
      console.log('done', err);
    });
  });


  /*
  const question = db.collection('question');
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
  });
  */ 
});