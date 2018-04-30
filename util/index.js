const log4js = require('log4js');
const config = require('../config');

const util = {};
log4js.configure(config.logSettings);
util.logger = {
	zhihu: log4js.getLogger('zhihu')
}

util.logger.zhihu.setLevel(config.logSettings.zhihuLogLevel);



util.dingding = function (key, err) {
	util.logger.zhihu.error(err);
};


const mongoose = require('mongoose');
const mongodbOpt = {
  useMongoClient: true,
  reconnectTries: 30,
  reconnectInterval: 30 * 1000,
  poolSize: 50
}

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.db.mongodb.host + '/' + config.db.mongodb.name, mongodbOpt).catch(function (err) {
  util.dingding('can not connect mongodb', { err });
});

const connection = mongoose.connection;
connection.on('error', (err) => {
  util.dingding('mongodb.error', { err });
});


module.exports = util;