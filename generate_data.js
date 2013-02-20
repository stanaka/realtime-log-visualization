var mongoose = require('mongoose');
var mongoOptions = {
  db: { safe: true },
  server: { auto_reconnect: true}
};

var uri = 'mongodb://localhost/fluent';
var collectionName = 'proxy.access_logs';
var db = mongoose.connect(uri, mongoOptions, function (err, res){
  if (err) { 
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
    process.exit(1);
  } else {
    console.log ('Succeeded connected to: ' + uri);
    
    var logSchema = new mongoose.Schema({
      host: String,
      req: String,
      status: String,
      size: String,
      referer: String,
      ua: String,
      taken: String,
      cache: String,
      runtime: String,
      time: Date
    }, {
      capped: 1024 * 1024
    });
    var Log = mongoose.model(collectionName, logSchema);

    var genStatus = function(){
      x = Date.now() / 1000 / 100;
      r = Math.random();
      threshold = 0.9 + Math.sin(x) / 10.0;
      if(r < threshold){
        return 200;
      } else if(r < threshold + 0.1){
        return 301;
      } else if(r < threshold + 0.05){
        return 404;
      } else {
        return 503;
      }
    };
    
    setInterval(function(){
      var record = new Log({
        status: genStatus(),
        time: Date.now(),
        req: 'GET / HTTP/1.0'
      });
      record.save(function(err){
        if(err){
          console.log("Error:"+err);
        }
      });
    }, 200);
  }
});


