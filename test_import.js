
var SVG = require('./SVG.js');

SVG.setup(450,600);
//SVG.translate(225,300);

var circle = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(0,0),
    radius: 20,
    fillColor: 'green'
});

var circle = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(450,600),
    radius: 20,
    fillColor: 'green'
});

SVG.importSVGFile('./test_in.svg', function(err, res){

  if(err){

    console.log('error', err);
    return;

  }

  //console.log('result', res.children);

  var paths = SVG.getAllChildren(res);

  for(var i = 0; i < paths.length; i++){

    //var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="blue" d="' + paths[i].d + '" />');

    var segments = SVG.getPathSegments(paths[i],2);

    console.log('segments.length:', segments.length);

    for(var j = 0; j < segments.length; j++){

      var point = segments[j].point;

      console.log('point:', point.x, point.y);

      var circle = new SVG.paper.Path.Circle({
          center: point,
          radius: 5,
          fillColor: 'red'
      });
    }
  }

  SVG.export('./test_out.svg');

});
