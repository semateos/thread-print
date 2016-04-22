
console.log('Hola!');


var prompt = require('prompt');
var polargraph = require('./polargraph.js');

prompt.message = '';
prompt.delimiter = '';


var SVG = require('./SVG.js');

var paper = SVG.paper;

SVG.setup(450,600);

var scale = 0.5;

var home = new SVG.paper.Point(250, 325);


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
    center: new SVG.paper.Point(450,600),
    radius: 3,
    fillColor: 'red'
});



var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://127.0.0.1:3002/meteor';

var mongodb;

var drawPaths = [];

MongoClient.connect(url, function(err, db) {

  assert.equal(null, err);

  console.log("Connected correctly to server.");

  mongodb = db;

  var paths = db.collection('paths');

  var top = 0;

  //var filter = {top: {$gt: top}};

  var filter = {};

  paths.find(filter).toArray(function(err, items){

    if(err){

      console.log(err);
    }

    console.log('found paths', items);

    drawPaths = [];

    for(var i = 0; i < items.length; i++){

      var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="red" d="' + items[i].d + '" />');

      var flatPath = SVG.flatten(item, scale);

      item.remove();

      flatPath.position.x *= scale;
      flatPath.position.y *= scale;

      flatPath.scale(scale);

      flatPath.translate(home);

      drawPaths.push(flatPath);

    }

    SVG.export('./test_out.svg');

    db.close();

  });


});



function drawPaths(paths){

  for(var i = 0; i < paths.length; i++){

    var path = paths[i];

    var segments = path.segments;

    var new_path = [];

    var isClosed = path.isClosed;

    for(var j = 0; j < segments.length; j++){

      var point = segments[j].point;

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


}





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

  //polargraph.setHomePosition();

  polargraph.start();

});

//
// Start the prompt
//
prompt.start();

var doPrompt = function(){

  prompt.get(['>'], function (err, result) {

    if(!err){

      mongodb.close();

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
