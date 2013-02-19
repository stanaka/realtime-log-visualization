var model = require('../model');
var Log = model.Log;

exports.index = function(req, res){
  res.render('index', { title: 'index' } );
};

exports.update = function(req, res) {
  req.socket.setTimeout(Infinity);

  var stream;
  Log.findOne().sort({_id:-1}).exec(function(err, item){
    if(err){
      console.log(err);
    }
    stream = Log.find().gt('_id', item._id).sort({'$natural': 1}).tailable().stream();
    var messageCount = 0;

    stream.on("error", function(err) {
      console.log("Mongo Error: " + err);
    });

    stream.on('data', function(doc){
      messageCount++;
      console.log(messageCount + '/' + doc.time);
      res.write('id: ' + messageCount + '\n');
      var msg = "{" +
        '"status":"' + doc.status + '",' +
        '"taken":"' + doc.taken + '",' +
        '"path":"' + doc.ridgedispatch + '",' +
        '"req":"' + doc.req + '"}';
      res.write("data: "+msg+"\n\n"); // Note the extra newline
    });

    stream.on('close', function(){
      console.log("Mongo closed");
    });
});

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
 
  req.on("close", function() {
    stream.destroy();
    console.log("Client disconnected.");
  });
};
