const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  const answer = db.collection('answer');
  const answerCache = db.collection('answer_cache');
  const questions = require('./question.json');

  const arr = [];
  async.eachSeries(questions, (q, next) => {
    try {
      const answers = require('./answers/' + q.id + '.json');
      if (!answers.length) {
        return next();
      }
      const doc = {
        qid: q.id,
        cache: {}
      };
      const cache = doc.cache;
      answer.insertMany(answers.map((item) => {
        cache[item.id] = true;
        return {
          qid: q.id,
          created_time: item.created_time,
          id: item.id,
          voteup_count: item.voteup_count,
          content: item.content,
          comment_count: item.comment_count,
          updated_time: item.updated_time,
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
        arr.push(doc);
        next();
      }).catch((err) => {
        console.log(q.title, q.id, err);
        next()
      });
    } catch(err) {
      console.log('require', q.title, q.id, err);
      process.exit(0)
    }
  }, (err) => {
    console.log('done', err);
    answerCache.insertMany(arr)
    .then((result) => {
      console.log('cache done');
    }).catch((err) => {
      console.log(err);
    });
  })  
});