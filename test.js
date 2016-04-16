
var SVG = require('./SVG.js');
var paths = require('./paths.json');


SVG.setup(2000,2000);
SVG.translate(1000,1000);

var circle = new SVG.paper.Path.Circle({
    center: new SVG.paper.Point(0,0),
    radius: 20,
    fillColor: 'green'
});

for(var i = 0; i < paths.length; i++){

  var item = SVG.importSVGPathString('<path fill="none" stroke-width="2" stroke="blue" d="' + paths[i].d + '" />');

  var segments = SVG.getPathSegments(item,2);

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

SVG.export('./test.svg');
