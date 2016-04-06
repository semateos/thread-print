console.log('yo');

var SerialPort = require("serialport").SerialPort
var portName = "/dev/cu.usbmodem1421";


serialPort = new SerialPort(portName, {
    baudrate: 9600,
    // defaults for Arduino serial communication
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

serialPort.on("open", function () {

  console.log('open serial communication');

  // Listens to incoming data
  serialPort.on('data', function(data) {

    var receivedData = data.toString();

    console.log('recieved', receivedData);
  });

  serialPort.write('testE', function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});
