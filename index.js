
console.log('Hola!');

var EventEmitter = require('events');
var util = require('util');

var prompt = require('prompt');
var SerialPort = require("serialport").SerialPort

var portName = "/dev/cu.usbmodem1421";

var mmPerRev = 31;
var stepsPerRev = 800;

var stepsPerMM = stepsPerRev / mmPerRev;
var mmPerStep = mmPerRev / stepsPerRev;

var machineWidth = 1100;
var machineHeight = 1100;

var home = {x:machineWidth/2, y:machineHeight/2};


function MyEmitter() {
  EventEmitter.call(this);
}

util.inherits(MyEmitter, EventEmitter);

var myEmitter = new MyEmitter();


var coordsToLength = function(x,y){

  var L = Math.round(Math.hypot(x,y) * stepsPerMM);
  var R = Math.round(Math.hypot(machineWidth - x, y) * stepsPerMM);

  return {l:L,r:R};
}

//console.log('coords', coordsToLength(550,550));

var path = [{x:600,y:550},{x:600,y:600},{x:550,y:600},{x:550,y:550}];

var commands = [];

var homeLengths = coordsToLength(home.x, home.y);

var homeCommand = 'C09,' + homeLengths.l + ',' + homeLengths.r + ',END';

commands.push(homeCommand);

for(var i = 0; i < path.length; i++){

  var point = path[i];

  var lengths = coordsToLength(point.x, point.y);

  commands.push('C17,' + lengths.l + ',' + lengths.r + ',2,END');
}

var i = 0;


serialPort = new SerialPort(portName, {
    baudrate: 57600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

var writeNextCommand = function(){

  if(i < commands.length){

    var command = commands[i];
    i++;

    console.log('>' + command);

    serialPort.write(command + "\n", function(err, results) {

      if(err){
        console.log('err ' + err);
      }else{
        console.log('results ' + results);
      }
      //writeNextCommand();
    });

  }


}

/*
myEmitter.on('ready', function(){

  console.log('READY');

  //writeNextCommand();
});
*/

serialPort.on("open", function () {

  console.log('open serial communication');

  // Listens to incoming data
  serialPort.on('data', function(data) {

    var receivedData = data.toString();

    console.log(receivedData);

    if(receivedData.indexOf("READY") != -1){

      console.log('matches READY');

      myEmitter.emit('ready');
    }


  });



  //console.log('>' + homeCommand);
  /*
  serialPort.write(homeCommand + "\n", function(err, results) {
    //console.log('err ' + err);
    console.log('results ' + results);
  });
  */
});


prompt.message = '';
prompt.delimiter = '';

//
// Start the prompt
//
prompt.start();



var doPrompt = function(){

  prompt.get(['>'], function (err, result) {

    if(!err){

      myEmitter.on('ready', function(){

        console.log('READY');

        writeNextCommand();
      });


      var input = result['>'];

      //var input = commands[i];
      //i++;

      console.log('>' + input);

      if(input){

        serialPort.write(input + "\n", function(er2, res2) {

          if(er2){

            console.log('serial error:', er2);

          }else{

            console.log('serial response: ', res2);
          }

        });
      }

      setTimeout(doPrompt, 50);

    }else{

      prompt.stop();
    }

  });
}

setTimeout(doPrompt, 100);
