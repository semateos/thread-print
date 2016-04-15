//var strSVG = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px" height="600px" viewBox="0 0 800 600" enable-background="new 0 0 800 600" xml:space="preserve">  <g id="111"> <rect x="130" y= "130" height="320" width="550" id="rect1" fill ="white" stroke="blue" >       </rect>  </g></svg>'
//var strYourText = 'Hello';

var point = require('point-at-length');
var jsdom = require("jsdom");
var paths = require('./paths.json');
//console.log(paths);

var strSVGstart = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="2000px" height="2000px" viewBox="-1000 -1000 1000 1000" enable-background="new -1000 -1000 1000 1000" xml:space="preserve">'
var pathSVG = '<rect x="130" y= "130" height="320" width="550" id="rect1" fill ="white" stroke="blue" ></rect>';
var strSVGend = '</svg>';



var svg = strSVGstart + pathSVG + strSVGend;

//console.log(svg);

// Please note: When loading paper as a normal module installed in node_modules,
// you would use this instead:
var paper = require('./dist/paper-core.js');
var path = require('path');
var fs = require('fs');

paper.setup(new paper.Size(2000, 2000));



with (paper) {

  for(var i = 0; i < paths.length; i++){

    var item = paper.project.importSVG('<path fill="none" id="path-' + i + '" stroke-width="5" stroke="red" d="' + paths[i].d + '" />');

    //console.log(item.length);

    var segment_size = 10;

    var segments = Math.ceil(item.length/segment_size);

    for(var j = 0; j < segments; j++){

      var point = item.getPointAt(segment_size * j);

      var circle = new Path.Circle({
          center: point,
          radius: 5,
          fillColor: 'blue'
      });
    }
  }

  
  project.view.translate(new Point(1000, 1000));

  var svg = project.exportSVG({ asString: true });
  //console.log(svg);

  fs.writeFile(path.resolve('./out.svg'),svg, function (err) {
      if (err) throw err;
      console.log('Saved!');
  });
}
