
console.log('Hola!');


var prompt = require('prompt');
var polargraph = require('./polargraph.js');
var Queue = require('queuejs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

prompt.message = '';
prompt.delimiter = '';


var SVG = require('./SVG.js');

var paper = SVG.paper;

SVG.setup(1100,1100);

var scale = 0.2;

var home = new SVG.paper.Point(550, 550);


var circle1 = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(0,0),
    radius: 3,
    fillColor: 'red'
});

var circle2 = new SVG.paper.Path.Circle({
    center: home,
    radius: 3,
    fillColor: 'red'
});

var circle3 = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(1100,1100),
    radius: 3,
    fillColor: 'red'
});





var mongoServerUrl = 'mongodb://psylocke-2.local:27017/thread';

var mongodb;

//var pathsToDraw = new Queue();

var pathsCollection;


var drawPath = function(path){

  console.log('drawing path');

  polargraph.liftPen();

  var segments = path.segments;

  //console.log(segments);

  var new_path = [];

  var isClosed = path.isClosed;

  for(var j = 0; j < segments.length; j++){

    var point = path.localToGlobal(segments[j].point);

    //console.log('point', point.x,point.y);

    if(j == 0){

      first = point;

      polargraph.moveDirect(point.x,point.y);

      polargraph.dropPen();

    }else{

      polargraph.moveDirect(point.x, point.y);
    }

    if(isClosed && j == segments.length - 1){

      //polargraph.moveDirect(first.x,first.y);
    }
  }

  polargraph.liftPen();
}


var lastCreated = false;

var getPathsBlock = function(){

  var filter = {};

  if(lastCreated){

    filter = {"created":{$gt:lastCreated}}
  }

  pathsCollection.find(filter).sort({"created":1}).limit(10).toArray(function(err, items){

    if(err){

      console.log(err);

      mongoConnect();
    }

    if(items && items.length){

      //console.log('found items:', items.length);

      lastCreated = items[items.length - 1].created;


      console.log('found items:', items.length, lastCreated);

      //console.log('found paths', items);

      //pathsToDraw = [];

      for(var i = 0; i < items.length; i++){

        var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="red" d="' + items[i].d + '" />');

        var flatPath = SVG.flatten(item, scale);

        item.remove();

        flatPath.position.x *= scale;
        flatPath.position.y *= scale;

        flatPath.scale(scale);

        flatPath.translate(home);

        drawPath(flatPath);

        //pathsToDraw.enq(flatPath);

      }

    }else{

      console.log('no items found, going home...');

      //polargraph.moveHome();

      //SVG.export('./test_out.svg');
    }



    //SVG.expogit strt('./test_out.svg');

    //drawPaths(pathsToDraw);

    //polargraph.moveHome();

    //db.close();

  });

}



var interval;


var mongoConnect = function(){

  console.log("attempting mongo connection");

  MongoClient.connect(mongoServerUrl, function(err, db) {

    assert.equal(null, err);

    console.log("Connected correctly to server.");

    mongodb = db;

    pathsCollection = db.collection('paths');

    if(interval){

      clearInterval(interval);
    }

    interval = setInterval(getPathsBlock, 1000);

  });

}



//mongoConnect();





/*
SVG.importSVGFile('./test_draw.svg', function(err, res){

  if(err){

    console.log('error', err);
    return;

  }

  circle1.remove();
  circle2.remove();

  //console.log('result', res.children);

  var paths = SVG.getAllChildren(res);

  for(var i = 1; i < paths.length; i++){

    //var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="blue" d="' + paths[i].d + '" />');

    polargraph.liftPen();

    var segments = SVG.getPathSegments(paths[i],1);

    var new_path = [];

    var isClosed = segments.isClosed;

    var first;

    for(var j = 0; j < segments.length; j++){

      var point = segments[j].point;

      point.x += 325;
      point.y += 250;

      if(j == 0){

        first = point;

        polargraph.moveDirect(point.x,point.y);

        polargraph.dropPen();

      }else{

        polargraph.moveDirect(point.x, point.y);
      }

      if(isClosed && j == segments.length - 1){

        polargraph.moveDirect(first.x,first.y);
      }

    }
  }

  polargraph.liftPen();

  //console.log('QUEUE', polargraph.commandQueue);

});

polargraph.moveHome();



/*
var path = [{x:600,y:550},{x:600,y:600},{x:550,y:600},{x:550,y:550}];



polargraph.dropPen();

polargraph.moveAlongPath(path);

polargraph.liftPen();
*/



polargraph.connect(function(err){

  if (err) {

    return console.log('Error connecting: ', err.message);
  }

  polargraph.setHomePosition();

  polargraph.start();

  mongoConnect();

});

//
// Start the prompt
//
prompt.start();

var doPrompt = function(){

  prompt.get(['>'], function (err, result) {

    if(!err){

      //mongodb.close();
      polargraph.moveHome();

      var input = result['>'];

      console.log('>' + input);

      if(input){

        polargraph.queueCommand(input);

      }

      setTimeout(doPrompt, 50);

    }else{

      prompt.stop();
    }

  });
}

setTimeout(doPrompt, 100);
