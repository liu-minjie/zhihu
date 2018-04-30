// TODO: generate config json via process.env.NODE_ENV

const path = require('path');
const fs = require('fs');

// Initialize logger
const logDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

module.exports = {
  logSettings: {
    appenders: [{
      type: 'console'
    }, {
      type: 'file',
      filename: logDir + '/zhihu.log',
      category: 'zhihu'
    }],
    zhihuLogLevel: 'WARN',
    replaceConsole: true
  },
  db: {
    mongodb: {
      host: '127.0.0.1',
      username: 'admin',
      pass: '',
      name: 'zhihu'
    }
  }
};