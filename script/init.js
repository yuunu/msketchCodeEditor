// load setting files
var settings = JSON.parse(loadFile('./settings.json'));

// init socket server
var socket = io.connect(window.location.hostname+':'+settings.ports.serverPort);

// Get ports info at startup
socket.on('ports', function(data){
    $('#tool_ports').append($('<option>', {value: data.comName, text: data.comName +": "+ data.manufacturer}));
});

// Console info
socket.on('console', function(data){
    if($('#hw_console').text().split('\n').length>100){
        $('#hw_console').html(data + '<br/>');
    }else{
        $('#hw_console').html($('#hw_console').html() + data + '<br/>');
    }
    $('#hw_console').scrollTop($('#hw_console')[0].scrollHeight);
});

// Visualizer
socket.on('visualizer', function(data){
    var _time = parseInt( ((new Date()).getTime()% settings.editor.visWindow) );

    addData(sensorChart, data.name, {x: _time, y: parseInt(data.value)})
});

function loadSavedFile(){
    editorJ5.setValue(loadFile(settings.files.hwCode));
    editorJ5.gotoLine(editorJ5.session.getLength());
    editorP5.setValue(loadFile(settings.files.p5Code));
    editorP5.gotoLine(editorP5.session.getLength());
}

function loadFile(_filePath){
    var _listPath =_filePath;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", _listPath, false);
    xmlhttp.send(null);

    return xmlhttp.responseText;
}

/* init Chart */
var ctx = document.getElementById('hw_sensor_chart').getContext('2d');
var sensorChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [],
    },
    options: {
        maintainAspectRatio: false,
        tooltips: {
            enabled: false
        },
        scales: {
            yAxes: [],
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                display: true,
                ticks: {
                    min: 0,
                    max: parseInt(settings.editor.visWindow)
                }
            }]
        },
        legend: {

            position: 'bottom',
            labels: {
                usePointStyle: true
            }
        }
    }
});

// DC3C57 FC5B3F FCB03C 6FB07F 068587 1A4F63
var chartColors = ['#DC3C57', '#FC5B3F', '#FCB03C', '#6FB07F', '#068587', '#1A4F63'];

function addDataset(_chart, _label){
    _chart.data.datasets.push({
        label: _label,
        fill: false,
        pointBackgroundColor: '#fff',
        backgroundColor: '#fff',
        borderColor: chartColors[parseInt( (_chart.data.datasets.length)%(chartColors.length) )],
        pointRadius: 2,
        data: []
    });
    _chart.update();
}

function addData(_chart, _label, _data){
    var _dataCheck = false;

    for(var i=0; i<_chart.data.datasets.length; i++){
        if(_chart.data.datasets[i].label == _label){
            _chart.data.datasets[i].data.push(_data);
            _dataCheck = true;

            if(_data.x >= ( parseInt(settings.editor.visWindow)-100 ) ){
                _chart.data.datasets[i].data = [];
            }
        }
    }
    _chart.update();

    if(!_dataCheck){
        addDataset(_chart, _label);
    }

}


$('document').ready(function(){
    loadSavedFile();

    $('#tool_ports').append($('<option>', {value: 'raspi', text:"Raspberry Pi 3"}));

    // hide other views
    //$('#layout_hw').hide();
    $('#layout_p5').hide();
    $('#layout_setting').hide();

    $('#tab_hw').click(function(){
        hideAll();
        $('#layout_hw').show();
        $('#tab_hw').addClass('active');
    });
    $('#tab_p5').click(function(){
        hideAll();
        $('#layout_p5').show();
        $('#tab_p5').addClass('active');
    });
    $('#tab_setting').click(function(){
        hideAll();
        $('#layout_setting').show();
        $('#tab_setting').addClass('active');
    });

    /* set sizing */
    $('#hw_editor').css('left', $('#tab_left').outerWidth());
    $('#hw_editor').css('right', $('#hw_panel').outerWidth());
    $('#hw_editor').css('top', $('#hw_toolbar').outerHeight());
    $('#hw_editor').css('bottom', $('#hw_console').outerHeight());

    $('#hw_console').css('left', $('#tab_left').outerWidth());
    $('#hw_console').css('right', $('#hw_panel').outerWidth());

    $('#p5_editor').css('left', $('#tab_left').outerWidth());
    $('#p5_editor').css('right', $('#p5_panel').outerWidth());
    $('#p5_editor').css('top', $('#p5_toolbar').outerHeight());
    $('#p5_editor').css('bottom', 0);

    $('#layout_setting').css('left', $('#tab_left').outerWidth());
    $('#layout_setting').css('right', 0);
    $('#layout_setting').css('top', 0);
    $('#layout_setting').css('bottom', 0);

    // settings
    $('#setting_serverPort').val(settings.ports.serverPort);
    $('#setting_appPort').val(settings.ports.appPort);
    $('#setting_visWindow').val(settings.editor.visWindow);
});

function hideAll(){
    $('#layout_hw').hide();
    $('#layout_p5').hide();
    $('#layout_setting').hide();

    $('#tab_hw').removeClass('active');
    $('#tab_p5').removeClass('active');
    $('#tab_socket').removeClass('active');
    $('#tab_setting').removeClass('active');
}
