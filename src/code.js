var board = new five.Board({port: "COM8"});

board.on("ready", function(){
   this.pinMode(0, five.Pin.ANALOG);
   
   this.analogRead(0, function(voltage){
       visualize("mic", voltage);
       socket.emit("mic", voltage)
   })
    
});