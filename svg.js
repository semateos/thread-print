//var strSVG = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px" height="600px" viewBox="0 0 800 600" enable-background="new 0 0 800 600" xml:space="preserve">  <g id="111"> <rect x="130" y= "130" height="320" width="550" id="rect1" fill ="white" stroke="blue" >       </rect>  </g></svg>'
//var strYourText = 'Hello';

var point = require('point-at-length');
var jsdom = require("jsdom");
var paths = require('./paths.json');
//console.log(paths);

var strSVGstart = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="2000px" height="2000px" viewBox="-1000 -1000 1000 1000" enable-background="new -1000 -1000 1000 1000" xml:space="preserve">'
var pathSVG = '<rect x="130" y= "130" height="320" width="550" id="rect1" fill ="white" stroke="blue" ></rect>';
var strSVGend = '</svg>';

for(var i = 0; i < paths.length; i++){

  pathSVG += '<path fill="none" id="path-' + i + '" stroke-width="5" stroke="red" d="' + paths[i].d + '" />';

  try{

    var pts = point(paths[i].d);

    var len = pts.length();

    var pointCount = Math.ceil(len / 10);

    //console.log('lengths', len);

    for (var j = 0; j <= pointCount; j++) {

      var pt = pts.at(j / pointCount * len);

      pathSVG += '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="5" stroke="none" fill="blue" />';
    }

  }catch(e){}
}

var svg = strSVGstart + pathSVG + strSVGend;

console.log(svg);

/*
jsdom.env({
        html : svg,
        done : function (err, window) {

          if(err){

            console.log('error:', err);
          }

          var path = window.document.getElementById("path-92");

          console.log('path-92', path);
        }
    }
);
*/
