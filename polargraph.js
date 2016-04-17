

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var config = require('./config.json');

var EventEmitter = require('events');
var util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
}

util.inherits(MyEmitter, EventEmitter);


var polargraph = {

  mmPerRev: config.mmPerRev,
  stepsPerRev: config.stepsPerRev,

  stepsPerMM: config.stepsPerRev / config.mmPerRev,
  mmPerStep: config.mmPerRev / config.stepsPerRev,

  machineWidth: config.machineWidth,
  machineHeight: config.machineHeight,

  home: {
    x:config.machineWidth/2,
    y:config.machineHeight/2
  },

  serialPort: new SerialPort(config.portName, {
    baudrate: 57600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline('\n')
  }, false),

  emitter: new MyEmitter(),

  commandQueue: [],

  commandIndex: 0,

  paused: true,

  queueCommand: function(commandString){

    this.commandQueue.push(commandString);
  },

  sendNextCommand: function(){

    if(this.commandIndex < this.commandQueue.length){

      var command = this.commandQueue[this.commandIndex];

      this.commandIndex++;

      this.serialPort.write(command + "\n", function(err, results) {

        console.log('sent >', command);

        if(err){

          console.log('err ' + err);

        }else{

          console.log('results ' + results);
        }

      });
    }
  },

  start: function(){

    this.paused = false;
  },

  pause: function(){

    this.paused = true;
  },


  //take a postion in x,y measured in mm
  //return step position for each motor
  positionToSteps: function(x,y){

    console.log('positionToSteps', x, y);


    //left motor line length in steps
    var L = Math.round(Math.hypot(x,y) * this.stepsPerMM);

    //right motor line length in steps
    var R = Math.round(Math.hypot(this.machineWidth - x, y) * this.stepsPerMM);

    return {l:L,r:R};
  },

  //** polargraph commands **//

  dropPen: function(){

    this.queueCommand('C13,' + config.penDownPosition + ',END');
  },

  liftPen: function(){

    this.queueCommand('C14,' + config.penUpPosition + ',END');
  },

  //set the current position of the pen
  setPenPosition: function(x,y){

    var steps = this.positionToSteps(x,y);

    var command = 'C09,' + steps.l + ',' + steps.r + ',END';

    this.queueCommand(command);
  },

  //set pen position to home location
  setHomePosition: function(){

    this.setPenPosition(this.home.x, this.home.y);
  },

  //move on a direct line to position
  moveDirect: function(x,y){

    var lengths = this.positionToSteps(x,y);

    this.queueCommand('C17,' + lengths.l + ',' + lengths.r + ',2,END');
  },

  //takes an array of points sets move commands for each point
  moveAlongPath: function(path){

    for(var i = 0; i < path.length; i++){

      var point = path[i];

      this.moveDirect(point.x, point.y);
    }
  },


  //** setup and connect to device **//

  connect: function(callback){

    var self = this;

    //send the next command in the queue when device responds 'ready'
    this.emitter.on('ready', function(){

      //only if the queue isn't paused
      if(!self.paused){

        self.sendNextCommand();
      }
    });

    //read data from the serial port
    this.serialPort.on('data', function(data){

      var receivedData = data.toString();

      console.log(receivedData);

      //emit ready event when we read 'ready' on the port
      if(receivedData.indexOf("READY") != -1){

        self.emitter.emit('ready');
      }

    });

    this.serialPort.on("open", function(){

      console.log('serial port open');

    });

    //open serial connection and call the callback
    this.serialPort.open(function(err){

      callback(err);

    });

  }


}


module.exports = polargraph;



//console.log('coords', coordsToLength(550,550));
/*
var path = [{x:600,y:550},{x:600,y:600},{x:550,y:600},{x:550,y:550}];

polargraph.connect(function(err){

  if (err) {

    return console.log('Error connecting: ', err.message);
  }

  polargraph.dropPen();

  polargraph.moveAlongPath(path);

  polargraph.start();

});
*/
