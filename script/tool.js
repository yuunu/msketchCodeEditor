// Run code
$('#tool_run').on('click', function(){
    socket.emit('execute', {type: 'hw', code: editorJ5.getValue()});
});

// Save and Open P5
$('#tool_open').on('click', function(){
    socket.emit('execute', {type: 'p5', sketch: editorP5.getValue()});
    window.open('./sketch/');
});

$('#tool_refresh').on('click', function(){
    socket.emit('execute', {type: 'p5', sketch: editorP5.getValue()});
    $('#sw_preview').attr('src', "./sketch/");
});

$('#tool_save').on('click', function(){
    socket.emit('execute', {type: 'p5', sketch: editorP5.getValue()});
});

// Port Code Addition
$('#tool_addPorts').on('click', function(){
    var _boardType = $('#tool_ports').val();
    editorJ5.find('pi-io');
    if(!editorJ5.selection.isEmpty()){
        editorJ5.removeLines();
    }
    editorJ5.find('.Board');
    if(!editorJ5.selection.isEmpty()){
        editorJ5.removeLines();
    }

    if(_boardType == 'raspi'){
        editorJ5.insert("var PiIO = require('pi-io');\n");
        editorJ5.insert("var board = new five.Board({io: new PiIO()});\n");
    }else{
        editorJ5.insert("var board = new five.Board({port: \"" + _boardType + "\"});\n");
    }
});

// save settings

$('#setting_save').on('click', function(){
    settings.ports.serverPort = $('#setting_serverPort').val();
    settings.ports.appPort = $('#setting_appPort').val();
    settings.editor.visWindow = $('#setting_visWindow').val();

    socket.emit('settings', settings);
});
