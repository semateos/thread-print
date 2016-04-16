

// Please note: When loading paper as a normal module installed in node_modules,
// you would use this instead:
var paper = require('./dist/paper-core.js');
var path = require('path');
var fs = require('fs');

var SVG = {

  paper: paper,
  fs: fs,

  width: 1000,
  height: 1000,

  setup: function(width, height){

    this.width = width,
    this.height = height,

    paper.setup(new paper.Size(width, height));
  },

  translate: function(x,y){

    paper.project.view.translate(new paper.Point(x,y));
  },


  importSVGFile: function(filePath, callback){

    paper.project.importSVG(filePath, {

        onLoad: function(item) {
            callback(undefined, item);
        },

        onError: function(message) {
            callback(message, undefined);
        }
    });
  },

  importSVGPathString: function(svgPathString){

    return paper.project.importSVG(svgPathString);
  },

  getPathSegments: function(paperPath, segmentSize){

    /*
    var segmentCount = Math.ceil(paperPath.length/segmentSize);

    console.log('segmentCount:', segmentCount);

    var segments = [];

    for(var i = 0; i < segmentCount; i++){

      var point = paperPath.getPointAt(segmentSize * i);

      console.log('point:', point);

      segments.push(point);
    }
    */

    var segments = [];

    if(paperPath.flatten){

      var copy = paperPath.clone();

      copy.flatten(segmentSize);

      copy.add(paperPath.getPointAt(paperPath.length));

      segments = copy.segments;

      copy.remove();

    }else if(paperPath.toPath){

      var copy = paperPath.toPath(false);

      copy.flatten(segmentSize);

      //copy.add(paperPath.getPointAt(paperPath.length));

      segments = copy.segments;
    }

    return segments;
  },

  export: function(exportPath){

    var svg = paper.project.exportSVG({ asString: true });
    //console.log(svg);

    fs.writeFile(path.resolve(exportPath), svg, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

  }


}

module.exports = SVG;

//testing:

//console.log(paths);
