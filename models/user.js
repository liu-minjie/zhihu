const util = require('../util');
const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const User = mongoose.model('User', userSchema, 'user');


exports.list = function(page, cb) {
  User.find().sort({
    '_id': -1
  }).skip(page * 20)
  .limit(20)
  .exec((err, col) => {
    if (err) {
      util.dingding('models.user.list', { err, page });
      return cb(err);
    }
    cb(null, col)
  });
}


exports.User = User;