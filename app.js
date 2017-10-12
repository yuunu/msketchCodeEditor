'use strict';

// Initialize External Packages
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');
const sp = require('serialport');
const settingFile = './settings.json';

var VIS_HEADER = '[VIS]';

var HW_CODE, FULL_CODE, P5_CODE, HEADER_CODE, ARDUINO_METHOD;
var SERVER_PORT;

// Child Process for Johnny-Five and init
var spawn = require('child_process').spawn;
var fullScript = null;
var settings = {};

fs.readFile(settingFile, 'utf8', function(err, data) {
    // Read Setting Values
    settings = JSON.parse(data);

    SERVER_PORT     = parseInt(settings.ports.serverPort);

    HW_CODE         = settings.files.hwCode;
    FULL_CODE       = settings.files.fullCode;
    P5_CODE         = settings.files.p5Code;
    HEADER_CODE     = settings.files.headerCode;
    ARDUINO_METHOD  = settings.files.arduinoMethods;

    // Starting Server
    server.listen(SERVER_PORT, function(){
        console.log('[LOG] Server listening on :' + SERVER_PORT);
    });

    initChild();
});


app.use(express.static(__dirname));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(client){
    console.log('[LOG] Web IDE is connected.');

    sp.list(function (err, ports) {
      ports.forEach(function(port) {
        console.log('[LOG] Send Ports: ' + port.comName + ': ' + port.manufacturer);
        client.emit('ports', port);
      });
    });

    client.on('execute', function(data){
        if(data.type == 'hw'){
            try {
                fs.writeFile(HW_CODE, data.code, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log('[LOG] The HW code file was saved!');

                    restartChild(client);
                });
            } catch (err) {
                console.error('[ERR] Failed to execute script.', err);
            }
        }else{
            try {
                fs.writeFile(P5_CODE, data.sketch, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log('[LOG] The p5.js sketch file was saved!');
                });

            } catch (err) {
                console.error('[ERR] Failed to execute script.', err);
            }
        }

    });

    client.on('settings', function(data){
        try {
            fs.writeFile(settingFile, JSON.stringify(data, null, '\t'), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log('[LOG] The setting file was saved!');
            });

        } catch (err) {
            console.error('[ERR] Failed to execute script.', err);
        }
    });

    initConsole(client);
});



function initChild(){
    fullScript = spawn('node', [FULL_CODE]);
    fullScript.stdin.setEncoding('utf-8');
    fullScript.stdout.pipe(process.stdout);
    fullScript.stderr.pipe(process.stderr);
}

function restartChild(client){
    fullScript.kill();

    var _code = '';
    fs.readFile(HEADER_CODE, 'utf8', function(err, data) {
      _code += data;
      _code += 'server.listen('+parseInt(settings.ports.appPort)+');\r\n'
      //server.listen(45589);
      fs.readFile(HW_CODE, 'utf8', function(err, data) {
        _code += data;
        fs.readFile(ARDUINO_METHOD, 'utf8', function(err, data) {
          _code += data;
          fs.writeFile(FULL_CODE, _code, function(err) {
              console.log('[LOG] The full code file was created!');
              initChild();
              initConsole(client)
          });
        });
      });
    });
}

function initConsole(client){
    fullScript.stdout.on('data', function(data) {
        var _parsedData = data.toString().split('\n');
        for(var i in _parsedData){
            if(_parsedData[i].split('\t')[0] == VIS_HEADER){
                client.emit('visualizer', {name: _parsedData[i].split('\t')[1], value: _parsedData[i].split('\t')[2]});
            }else if(_parsedData[i]!=""){
                client.emit('console', _parsedData[i]+"\n");
            }
        }
    });

    fullScript.stderr.on('data', function(data) {
        client.emit('console', data.toString());
    });
}
