const util = require('../util');
const mongoose = require('mongoose');
const answerSchema = require('./answerSchema');
const Answer = mongoose.model('Answer', answerSchema, 'answer');
const loadComment = require('../bin/crawler_comment');



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

exports.comment = function (id, cb) {
  console.log(id);
  Answer.findOne({
    id: +id,
  }, (err, doc) => {
    if (err) {
      console.log(err, 'xxx');
      return cb(err)
    }
    if (!doc) {
      console.log('not found');
      return cb(new Error('not found'))
    }

    if (doc.comment.length) {
      return cb(null, doc.comment);
    } else {
      loadComment(id, {}, (err, data, count) => {
        if (err) {
          console.log(err, 3);
          return cb(err);
        }
        Answer.updateOne({
          _id: doc._id
        }, {
          comment_count: count,
          $push: {
            comment: {
              $each: data
            }
          }
        }, (err) => {
          if (err) {
            console.log(err, 2);
            return cb(err);
          }
          cb(null, data);
        })
      });
    }
  })
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