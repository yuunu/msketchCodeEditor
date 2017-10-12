// Functions
board.on("ready", function(){
    setup();
    setInterval(loop, 50);
});

var PWM = five.Pin.PWM;
var INPUT = five.Pin.INPUT;
var OUTPUT = five.Pin.OUTPUT;
var ANALOG = five.Pin.ANALOG;
var VIS_HEADER = '[VIS]';
var analogValues = [];
var digitalValues = [];

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

io.on('connection', function(socket){
    if(typeof socketEvent == 'function'){
        socketEvent(socket);
    }
});

function writeSocket(_tag, _data){
    return io.emit(_tag, _data);
}

function visualize(_tag, _value){
    console.log(VIS_HEADER+'\t' + _tag + '\t' + _value);
}
