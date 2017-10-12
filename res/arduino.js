// Functions
/*
board.on("ready", function(){
    setup();
    loopContainer();
});

function loopContainer(){
    loop();
    setTimeout(loopContainer, 30);
};

const PWM = five.Pin.PWM;
const INPUT = five.Pin.INPUT;
const OUTPUT = five.Pin.OUTPUT;
const ANALOG = five.Pin.ANALOG;
const HIGH = 1, LOW = 0;

var analogValues = [];
var digitalValues = [];

// IO
function pinMode(_pin, _mode){
    board.pinMode(_pin, _mode);

    if(_mode == ANALOG){
        board.analogRead(_pin, function(_value){
            analogValues[_pin] = _value;
        });
    }
    if(_mode == ANALOG){
        board.digitalRead(_pin, function(_value){
            digitalValues[_pin] = _value;
        });
    }
}

function analogWrite(_pin, _value){
    return board.analogWrite(_pin, _value);
}

function digitalWrite(_pin, _value){
    return board.digitalWrite(_pin, _value);
}

function analogRead(_pin){
    return analogValues[_pin];
}

function digitalRead(_pin){
    return digitalValues[_pin];
}

// time
function delay(_duration) {
    var _start = (new Date()).getTime();
    while( (new Date()).getTime() < (_start + _duration) ){
    };
}
*/

function millis(){
    return (new Date()).getTime();
}

// Sockets

io.on('connection', function(socket){
    if(typeof socketEvent == 'function'){
        socketEvent(socket);
    }
});


socket = function(){}

socket.emit = function(_tag, _data){
    return io.emit(_tag, _data);
}

const VIS_HEADER = '[VIS]';

// Visualizer
function visualize(_tag, _value){
    console.log(VIS_HEADER+'\t' + _tag + '\t' + _value);
}
