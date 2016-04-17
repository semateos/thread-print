

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


  getAllChildren: function(object){

    /*if(!object){
      object = paper.project.activeLayer;
    }*/

    var children = [];

    if(object && object.children){

      //console.log(typeof(object.children));

      for(var i = 0; i < object.children.length; i++){

        children.push(object.children[i]);

        children = children.concat(this.getAllChildren(object.children[i]));
      }

    }

    return children;

  },

  getPathSegments: function(paperPath, segmentSize){

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

      //copy.add(paperPath.getPointAt(0));

      segments = copy.segments;

      segments.isClosed = true;
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
