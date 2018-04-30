const MongoClient = require('mongodb').MongoClient;


function insert (data, cb) {
  MongoClient.connect('mongodb://127.0.0.1:27017', {
  }, (err, client) => {
    const db = client.db('itpub');
    const book = db.collection('book');
    book.insertMany(data).then((res) => {
      client.close();
      cb();
    }).catch((err) => {
      console.log(err);
      client.close();
      cb(err);
    });
  });
}

function search (key, cb) {
  MongoClient.connect('mongodb://127.0.0.1:27017', {
  }, (err, client) => {
    const db = client.db('itpub');
    const book = db.collection('book');
    book.find({
      name: new RegExp(key, 'i')
    }).toArray((err, docs) => {
      client.close();
      cb(err, docs)
    });
  });
}
module.exports = {
  insert: insert,
  search: search
}