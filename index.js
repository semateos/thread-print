
console.log('Hola!');

var prompt = require('prompt');
var polargraph = require('./polargraph.js');

prompt.message = '';
prompt.delimiter = '';

var SVG = require('./SVG.js');

SVG.setup(450,600);

var circle1 = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(0,0),
    radius: 1,
    fillColor: 'green'
});

var circle2 = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(450,600),
    radius: 1,
    fillColor: 'green'
});

SVG.importSVGFile('./test_draw.svg', function(err, res){

  if(err){

    console.log('error', err);
    return;

  }

  circle1.remove();
  circle2.remove();

  //console.log('result', res.children);

  var paths = SVG.getAllChildren(res);

  for(var i = 0; i < paths.length; i++){

    //var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="blue" d="' + paths[i].d + '" />');

    polargraph.liftPen();

    var segments = SVG.getPathSegments(paths[i],2);

    var new_path = [];

    for(var j = 0; j < segments.length; j++){

      var point = segments[j].point;

      var x = point.x + 325;
      var y = point.y + 225;

      if(j == 0){

        polargraph.moveDirect(x,y);

        polargraph.dropPen();

      }else{

        polargraph.moveDirect(x,y);
      }
    }
  }

  polargraph.liftPen();

  console.log('QUEUE', polargraph.commandQueue);

});





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


  polargraph.start();

});

//
// Start the prompt
//
prompt.start();

var doPrompt = function(){

  prompt.get(['>'], function (err, result) {

    if(!err){


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
