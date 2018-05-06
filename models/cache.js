const util = require('../util');
const mongoose = require('mongoose');
const fs = require('fs');
const cacheSchema = require('./cacheSchema');
const Cache = mongoose.model('Cache', cacheSchema, 'answer_cache');
const questionSchema = require('./questionSchema');
const Question = mongoose.model('Question', questionSchema, 'question');
const request = require('request');
const async = require('async');
const auth = require('../auth');

const answerSchema = require('./answerSchema');
const Answer = mongoose.model('Answer', answerSchema, 'answer');

function handleData(list, qid) {
  return list.map((item) => {
    return {
      qid: qid,
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
  })
}

function getAnswer (qid, cache, next) {
  let more = true;
  const include = encodeURIComponent('data[*].annotation_action,annotation_detail,comment_count,content,editable_content,voteup_count,created_time,updated_time,review_info,excerpt;data[*].mark_infos[*].url;data[*].author.follower_count,badge[?(type=best_answerer)].topics');
  const url = `https://www.zhihu.com/api/v4/questions/${qid}/answers`;
  const limit = 20;
  let offset = 0;
  let answers = [];
  async.whilst(() => {
    return more;
  }, (callback) => {
    request({
      url: `${url}?include=${include}&offset=${offset}&limit=${limit}&sort_by=created`,
      headers: {
        authorization: auth.data
      }
    }, (err, res, data) => {
      try {
        data = JSON.parse(data);
      } catch (e) {
        next(e);
        return callback(e);
      }
      
      offset += data.data.length;
      console.log('offset: ', offset);
      answers = answers.concat(data.data);
      const end = data.data.some((item) => {
        return cache[item.id];
      });

      if (data.paging.is_end || end || offset > 100) {
        more = false;
        const list = answers.filter((item) => {
          return !cache[item.id];
        });
        if (list.length) {
          //fs.writeFileSync(`data/answers/${qid}.json`, JSON.stringify(answers, null, 2), 'utf8');
        }
        next(null, list, data.paging.is_end || end);
      }
      callback();
    });
  }, (err) => {})
}

exports.update = function (qid, cb) {
  Cache.findOne({
    qid: qid
  }, (err, doc) => {
    if (err) {
      return cb(err)
    }
    if (!doc) {
      return cb(new Error('请更新缓存表'));
    }

    getAnswer(qid, doc.cache, (err, list, end) => {
      if (err) {
        return cb(err);
      }
      list.forEach((item) => {
        doc.cache[item.id] = true;
      });
      if (!list.length) {
        return cb(null, end);
      }
 
      Answer.insertMany(handleData(list, qid), {
        ordered: false
      }, (err, res) => {
        if (err) {
          console.log(err, 1);
          return cb(err);
        }
        
        doc.markModified('cache');
        doc.save((err) => {
          if (err) {
            console.log(err, 2);
            return cb(err)
          }
          console.log(list.length, res.length);
          Question.update({
            id: qid
          }, {
            $inc: {answer_count: res.length}
          }, (err) => {
            console.log(err, 3);
            cb(err, end, list.length - res.length);
          })
        });
      });
    });
  });
}


exports.Cache = Cache;