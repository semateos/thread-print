
console.log('Hola!');

prompt = require('prompt');
polargraph = require('./polargraph.js');

prompt.message = '';
prompt.delimiter = '';

var path = [{x:600,y:550},{x:600,y:600},{x:550,y:600},{x:550,y:550}];

polargraph.connect(function(err){

  if (err) {

    return console.log('Error connecting: ', err.message);
  }

  polargraph.dropPen();

  polargraph.moveAlongPath(path);

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
