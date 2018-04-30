const async = require('async');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017', {
}, (err, client) => {
	const db = client.db('zhihu');
  const answer = db.collection('answer');
  const questions = require('./question.json');
  async.eachSeries(questions, (q, next) => {
    try {
      const answers = require('./answers/' + q.id + '.json');
      answer.insertMany(answers.map((item) => {
        return {
          qid: q.id,
          created_time: item.created_time,
          id: item.id,
          voteup_count: item.voteup_count,
          content: item.content,
          comment_count: item.comment_count,
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
        next();
      }).catch((err) => {
        console.log(q.title, q.id, err);
        next()
      });
    } catch(err) {
      console.log('require', q.title, q.id, err);
    }
  }, (err) => {
    console.log('done', err);
  })  
});