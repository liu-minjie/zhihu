const util = require('../util');
const mongoose = require('mongoose');
const questionSchema = require('./questionSchema');
const Question = mongoose.model('Question', questionSchema, 'question');



exports.list = function(page, cb) {
  Question.find().sort({
    '_id': 1
  }).skip(page * 20)
  .limit(20)
  .exec((err, col) => {
    if (err) {
      util.dingding('models.question.list', { err, page });
      return cb(err);
    }
    cb(null, col)
  });
}


exports.addTag = function (id, tags, cb) {
  console.log(tags);
  Question.updateOne({
    id: id
  }, {
    tags: tags
  }, (err, doc) => {
    if (err) {
      console.log(err);
      return cb(err);
    }
    cb();
  });
}


exports.Question = Question;