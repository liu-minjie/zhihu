const util = require('../util');
const mongoose = require('mongoose');
const answerSchema = require('./answerSchema');
const Answer = mongoose.model('Answer', answerSchema, 'answer');



exports.list = function(qid, page, cb) {
  Answer.find({
    qid: qid
  }).sort({
    '_id': -1
  }).skip(page * 20)
  .limit(20)
  .exec((err, col) => {
    if (err) {
      util.dingding('models.answer.list', { err, page });
      return cb(err);
    }
    cb(null, col)
  });
}
exports.delete = function(id, cb) {
  Answer.deleteOne({
    _id: id
  }, cb);
}

exports.updateImag = function (aid, src, uid, cb) {
  Answer.findOne({
    id: +aid
  }, (err, doc) => {
    if (err) {
      return cb(err);
    }
    doc.content = doc.content.replace('data-actualsrc="' + src, 'data-actualsrc="/public/img/answer/' + uid);
    doc.save(cb);
  })
}


exports.Answer = Answer;