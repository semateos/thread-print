var strSVG = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="800px" height="600px" viewBox="0 0 800 600" enable-background="new 0 0 800 600" xml:space="preserve">  <g id="111"> <rect x="130" y= "130" height="320" width="550" id="rect1" fill ="white" stroke="blue" >       </rect>  </g></svg>'
var strYourText = 'Hello';
var jsdom = require("jsdom");

jsdom.env({
        html : strSVG,
        done : function (errors, window) {
            window.document.getElementById("rect1").innerHTML = strYourText;
            console.log(window.document.getElementsByTagName('html')[0].innerHTML);
        }
    }
);
