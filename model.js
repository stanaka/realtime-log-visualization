var mongoose = require('mongoose');
var mongoOptions = {
  db: { safe: true },
  server: { auto_reconnect: true},
  replset: { read_secondary: true}
};

var uri = 'mongodb://localhost/fluent';
var db = mongoose.connect(uri, mongoOptions, function (err, res){
  if (err) { 
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uri);
  }
});

var logSchema = new mongoose.Schema({
  forwardedfor: String,
  req: String,
  status: String,
  size: String,
  referer: String,
  ua: String,
  taken: String,
  cache: String,
  runtime: String,
  ridgedispatch: String,
  vhost: String,
  time: Date
});

var collection = 'proxy.access_logs';
exports.Log = db.model('Log', logSchema, collection);
