//dot2bcf2000 v 1.4.1 by ArtGateOne


var debugFile = false;
const fs = require('fs');  // for debug: Websocket.txt
var fsWritten = 0;
var fsDelete = true;

var easymidi = require('easymidi');
var W3CWebSocket = require('websocket')
    .w3cwebsocket;
var client = new W3CWebSocket('ws://10.1.1.10:80/'); //U can change localhost(127.0.0.1) to Your console IP address


//config
// var midi_in = 'loopMIDI';      //set correct midi in device name
// var midi_out = 'loopMIDI';     //set correct midi out device name
//var midi_in = 'X-Touch';      //set correct midi in device name
//var midi_out = 'X-Touch';     //set correct midi out device name
// var midi_in = 'X-USB MIDI IN';      // x32 via X-USB
// var midi_out = 'X-USB MIDI OUT';    // x32 via X-USB
var midi_in = 'DN32-USB';
var midi_out = 'DN32-USB';

var page_sw = 1;              //Auto Page switch on dot2  1 = ON, 0 = OFF
var blackout_toggle_mode = 0; //BlackOut toggle mode    1 = ON, 0 = OFF
var executors_view = 0;       //default executors view/control   0 = bottom, 1 = top
var wing = 2;                 //default core = 0, f-wing 1 or 2

var fader7 = "1.1";     //Core fader L SpecialMaster nr
var fader8 = "1.2";     //Core fader R SpecialMaster nr

var fader7_val = 16368; //default fader position for core L master fader
var fader8_val = 0;     //default fader position for core R master fader

var secondRow = 1;      //Display Fader-Label 0 = in first row, 1 = in second Row

//Uncoment when u wan use fader 8 as Grand Master in CORE
//fader8 = "2.1";
//fader8_val = 16368;



// more config below MCU-Button definitions !!!
//             ----------------------------



//----------------------------------------------------------------------------------------------
// Mackie Control Universal (MCU) Buttons = LEDs
//
// from: https://github.com/NicoG60/TouchMCU/blob/main/doc/mackie_control_protocol.md

// Button Group: Assignment / Encoder Assign
var MCU_TRACK  = 40;
var MCU_SEND   = 41;
var MCU_PANS   = 42;
var MCU_PLUGIN = 43;
var MCU_EQ     = 44;
var MCU_INST   = 45;
// Button Group: Fader Banks
var MCU_BANK_L = 46;
var MCU_BANK_R = 47;
var MCU_CHAN_L = 48;
var MCU_CHAN_R = 49;
var MCU_FLIP   = 50;
var MCU_GLOBAL = 51;
// Button Group: Display
var MCU_NAME   = 52;
var MCU_SMPTE  = 53; // not available in X-Touch Mode 'Xctl/MC' 
// Button Group: Function Select
var MCU_F1     = 54;
var MCU_F2     = 55;
var MCU_F3     = 56;
var MCU_F4     = 57;
var MCU_F5     = 58;
var MCU_F6     = 59;
var MCU_F7     = 60;
var MCU_F8     = 61;
// Button Group: Fader Banks
var MCU_MIDI   = 62;
var MCU_INPUTS = 63;
var MCU_AUDIO  = 64;
var MCU_INSTR  = 65;
var MCU_AUX    = 66;
var MCU_BUSSES = 67;
var MCU_OUTPUT = 68;
var MCU_USER   = 69;
// Button Group: Modify 
var MCU_SHIFT  = 70;
var MCU_OPTION = 71;
var MCU_CONTROL= 72;
var MCU_ALT    = 73;
// Button Group: Automation
var MCU_READ   = 74;
var MCU_WRITE  = 75;
var MCU_TRIM   = 76;
var MCU_TOUCH  = 77;
var MCU_LATCH  = 78;
var MCU_GROUP  = 79;
// Button Group: Utility
var MCU_SAVE   = 80;
var MCU_UNDO   = 81;
var MCU_CANCEL = 82;
var MCU_ENTER  = 83;
// Button Group: Transport
var MCU_MARKER = 84;
var MCU_NUDGE  = 85;
var MCU_CYCLE  = 86;
var MCU_DROP   = 87;
var MCU_REPLACE= 88;
var MCU_CLICK  = 89;
var MCU_SOLO   = 90;
var MCU_REWIND = 91;
var MCU_FORWARD= 92;
var MCU_STOP   = 93;
var MCU_PLAY   = 94;
var MCU_RECORD = 95;
// Button Group: Cursor
var MCU_UP     = 96;
var MCU_DOWN   = 97;
var MCU_LEFT   = 98;
var MCU_RIGHT  = 99;
var MCU_ZOOM   = 100;
var MCU_SCRUB  = 101;
// Button Group: User
var MCU_FOOT_1 = 102; // not tested
var MCU_FOOT_2 = 103; // not tested

//----------------------------------------------------------------------------------------------
// Button-Configs

// x-touch
// var buttonWing2 = MCU_TRACK ; // 40 = TRACK
// var buttonWing1 = MCU_PANS  ; // 42 = PAN
// var buttonWing0 = MCU_EQ    ; // 44 = EQ

// x32
var buttonWing2 = MCU_READ;
var buttonWing1 = MCU_WRITE;
var buttonWing0 = MCU_TRIM;

var buttonEdit  = MCU_SEND  ; // 41 = SEND
var buttonOff   = MCU_INST  ; // 45 = INST
var buttonClear = MCU_PLUGIN; // 43 = PLUG IN (Clear All = Off Page Thru = Off all Executors)

var buttonPage = new Array();
buttonPage[1] = MCU_MARKER  ; // 84 = MARKER
buttonPage[2] = MCU_NUDGE   ; // 85 = NUDGE
buttonPage[3] = MCU_CYCLE   ; // 86 = CYCLE
buttonPage[4] = MCU_DROP    ; // 87 = DROP
buttonPage[5] = MCU_REPLACE ; // 88 = REPLACE
buttonPage[6] = MCU_CLICK   ; // 89 = CLICK
buttonPage[7] = MCU_SOLO    ; // 90 = SOLO

buttonExecViewTop    = 96; // 96 = UP,   91 = bcf2000 
buttonExecViewBottom = 97; // 97 = DOWN, 93 = bcf2000



//----------------------------------------------------------------------------------------------
// default Values

var clear_button = 0;
var speedmaster1 = 60;
var speedmaster2 = 60;
var speedmaster3 = 60;
var speedmaster4 = 60;
var blackout = 0;
var grandmaster = 100;
var gmvalue = 43;
var sessionnr = 0;
var pageIndex = 0;

var request = 0;
var interval_on = 0;
var controller = 0;
var matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');
var valueText = "";


function interval() {
    if (sessionnr > 0) {
        if (wing == 2) {
            client.send('{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
        if (wing == 1) {
            client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
        if (wing === 0) {//not used
            client.send('{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[6,6,6],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
    }
}

//setInterval(interval, 100);


//display info
console.log(" ");
console.log(" ");
console.log("+++++++++++++++++++++++++ ");
console.log("     X-Touch to dot2      ");
console.log("+++++++++++++++++++++++++ ");
console.log(" ");

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

console.log(" ");

console.log("Connecting to midi device " + midi_in);

//open midi device
var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);


// clear all LCDs
output.send('sysex',[0xf0, 0x00, 0x00, 0x66, 0x14, 0x12, 0x00, 	
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,  // 7x ASCII
    // End
    0xf7
]);

display7segPage (pageIndex);

display7segExecView (executors_view);

display7segWing (wing);



input.on('cc', function (msg) {

    // -------------- Encoder -------------------------------
    if (msg.controller == 16) {//Encoder 1 = DIM
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"DIM","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"DIM","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 17) {//Encoder 2 = PAN
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"PAN","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"PAN","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 18) {//Encoder 3 = TILT
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"TILT","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"TILT","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 19) {//Encoder 4 = SpeedMaster 1
        if (msg.value < 60) {
            speedmaster1 = speedmaster1 + msg.value;
        } else {
            speedmaster1 = speedmaster1 - (msg.value - 64)
        }
        if (speedmaster1 < 0) {
            speedmaster1 = 0;
        }
        client.send('{"command":"SpecialMaster 3.1 At ' + (speedmaster1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 20) {//Encoder 5 = SpeedMaster 2
        if (msg.value < 60) {
            speedmaster2 = speedmaster2 + msg.value;
        } else {
            speedmaster2 = speedmaster2 - (msg.value - 64)
        }
        if (speedmaster2 < 0) {
            speedmaster2 = 0;
        }
        client.send('{"command":"SpecialMaster 3.2 At ' + (speedmaster2) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 21) {//Encoder 6 = SpeedMaster 3
        if (msg.value < 60) {
            speedmaster3 = speedmaster3 + msg.value;
        } else {
            speedmaster3 = speedmaster3 - (msg.value - 64)
        }
        if (speedmaster3 < 0) {
            speedmaster3 = 0;
        }
        client.send('{"command":"SpecialMaster 3.3 At ' + (speedmaster3) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 22) {//Encoder 7 = SpeedMaster 4
        if (msg.value < 60) {
            speedmaster4 = speedmaster4 + msg.value;
        } else {
            speedmaster4 = speedmaster4 - (msg.value - 64)
        }
        if (speedmaster4 < 0) {
            speedmaster4 = 0;
        }
        client.send('{"command":"SpecialMaster 3.4 At ' + (speedmaster4) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 23) {//Encoder 8 = grand master
        if (msg.value < 60) {
            grandmaster = grandmaster + msg.value;
        } else {
            grandmaster = grandmaster - (msg.value - 64);
        }
        if (grandmaster > 100) {
            grandmaster = 100;
        } else if (grandmaster < 0) {
            grandmaster = 0;
        }

        gmvalue = ((grandmaster / 10) + 33);

        if (blackout == 0) {
            client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }

        if (blackout == 1) {
            gmvalue = gmvalue - 32;
        }
        output.send('cc', { controller: 55, value: gmvalue, channel: 0 });
    }
});



input.on('pitch', function (msg) {//send fader pos do dot2
    if (wing == 0) {
        if (msg.channel < 6) {
            var faderValue = ((msg.value - 134) * 0.0000625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 1) { faderValue = 1; }
            client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');
        } else if (msg.channel == 6) {
            displayLCD(msg.channel, 0, "       ");
            displayLCD(msg.channel, 1, "       ");
            var faderValue = ((msg.value - 134) * 0.00625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 100) { faderValue = 100; }
            fader7_val = msg.value;
            output.send('pitch', { value: msg.value, channel: 6 });
            client.send('{"command":"SpecialMaster ' + fader7 + ' At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.channel == 7) {
            displayLCD(msg.channel, 0, "       ");
            displayLCD(msg.channel, 1, "       ");
            var faderValue = ((msg.value - 134) * 0.00625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 100) { faderValue = 100; }
            fader8_val = msg.value;
            output.send('pitch', { value: msg.value, channel: 7 });
            client.send('{"command":"SpecialMaster ' + fader8 + ' At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }
    else if (wing == 1 || wing == 2) {
        var faderValue = ((msg.value - 134) * 0.0000625)
        if (msg.value <= 134) { faderValue = 0; }
        if (faderValue > 1) { faderValue = 1; }
        client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');
    }

    
});

//send wing led status 
if (wing == 1) {
    output.send('noteon', { note: buttonWing0, velocity: 0, channel: 0 });
    output.send('noteon', { note: buttonWing1, velocity: 127, channel: 0 });
    output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 }); 
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    //matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
	matrix = [ 113, 112, 111, 110, 109, 108, 107, 106, 213, 212, 211, 210, 209, 208, 207, 206, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
	
} else if (wing == 2) {
    output.send('noteon', { note: buttonWing0, velocity: 0, channel: 0 });
    output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
    output.send('noteon', { note: buttonWing2, velocity: 127, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    //matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
	matrix = [ 121, 120, 119, 118, 117, 116, 115, 114, 221, 220, 219, 218, 217, 216, 215, 214, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
	
} else if (wing == 0) {
    output.send('noteon', { note: buttonWing0, velocity: 127, channel: 0 });
    output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
    output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    //matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
	matrix = [ 105, 104, 103, 102, 101, 100, 0, 0, 205, 204, 203, 202, 201, 200, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
	
    output.send('pitch', { value: fader7_val, channel: 6 });
    output.send('pitch', { value: fader8_val, channel: 7 });	
}


for (controller = 48; controller <= 55; controller++) {//reset encoder led
    output.send('cc', { controller: controller, value: 0, channel: 0 });
}
output.send('noteon', { note: buttonEdit, velocity: 0, channel: 0 });//led OFF EDIT key
output.send('noteon', { note: 45, velocity: 1, channel: 0 });//led INST     - clear blink
output.send('cc', { controller: 48, value: 63, channel: 0 });//led LEDsEnc1 - page 1
output.send('cc', { controller: 51, value: 33, channel: 0 });//led LEDsEnc4 - speedmaster 1: 1/12 LED
output.send('cc', { controller: 52, value: 34, channel: 0 });//led LEDsEnc5 - speedmaster 2: 2/12 LEDs
output.send('cc', { controller: 53, value: 35, channel: 0 });//led LEDsEnc6 - speedmaster 3: 3/12 LEDs
output.send('cc', { controller: 54, value: 36, channel: 0 });//led LEDsEnc7 - speedmaster 4: 4/12 LEDs
output.send('cc', { controller: 55, value: 54, channel: 0 });//led LEDsEnc8 - grandmaster:  11/12 LEDs
//output.send('sysex',[0xf0, 0x00, 0x00, 0x66, 0x05, 0x00, 0x10, 0x00, 0x00, 0x00, 0x31, 0x33, 0xf7]);
if (executors_view == 1) {//executors view
    output.send('noteon', { note: buttonExecViewTop, velocity: 127, channel: 0 });//top
    output.send('noteon', { note: buttonExecViewBottom, velocity: 0, channel: 0 });//bottom
} else {
    output.send('noteon', { note: buttonExecViewTop, velocity: 0, channel: 0 });//top
    output.send('noteon', { note: buttonExecViewBottom, velocity: 127, channel: 0 });//bottom
}


input.on('noteon', function (msg) {

    /*
    if (msg.note == 41 && msg.velocity == 127) {//encoder 1 click
      //output.send('cc', { controller: 54, value: testnote, channel: 0 });
      output.send('noteon', { note: 126, velocity:  testnote, channel: 0 });//led clear blink
      testnote++;
      console.log(testnote);
    }*/




    if (msg.note <= 31) {//send CH-buttons to dot2
        if (msg.note == 22 && wing == 0 || msg.note == 23 && wing == 0 || msg.note == 30 && wing == 0 || msg.note == 31 && wing == 0) {
            //do nothing (Wing 0: CH7+8 not used)
        } else if (executors_view == 0) {
            if (msg.note < 24) { // REC + SOLO + MUTE Buttons)
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else { // SELECT Buttons
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            }
        } else if (executors_view == 1) {
            if (msg.note < 16) {// do edit!!!!
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else if (msg.note >= 24) {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 24)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 24)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 8)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 8)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            }
        }
    }


    if (msg.note == 52 && msg.velocity == 127) {//DISPLAY NAME/VALUE (Off)  -> Off Main-Executor
        client.send('{"command":"Off","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 32 && msg.velocity == 127) {//1 enc click (Highlite)
        client.send('{"command":"Highlight","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 33 && msg.velocity == 127) {//2 enc click (Pan center)
        client.send('{"command":"Attribute PAN At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 34 && msg.velocity == 127) {//3 enc click (Tilt center)
        client.send('{"command":"Attribute TILT At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 35 && msg.velocity == 127) {//4 enc click (learn speedmaster 1)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.1","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster1 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.1","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }
    if (msg.note == 36 && msg.velocity == 127) {//5 enc click (learn speedmaster 2)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.2","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster2 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.2","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 37 && msg.velocity == 127) {//6 enc click (learn speedmaster 3)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.3","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster3 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.3","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 38 && msg.velocity == 127) {//7 enc click (learn speedmaster 4)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.4","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster4 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.4","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 39) {//8 enc click Blackout
        if (blackout_toggle_mode == 0) {
            if (msg.velocity == 127) {
                blackout = 1;
                client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                gmvalue = gmvalue - 32;

            } else {
                blackout = 0;
                client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                gmvalue = gmvalue + 32;
            }
        } else if (blackout_toggle_mode == 1) {
            if (msg.velocity == 127) {
                if (blackout == 0) {
                    blackout = 1;
                    client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                    gmvalue = gmvalue - 32;
                } else {
                    blackout = 0;
                    client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                    gmvalue = gmvalue + 32;
                }
            }
        }
        output.send('cc', { controller: 55, value: gmvalue, channel: 0 });
    }

    //if (msg.note == 42 && msg.velocity == 127) {//Clear All  = 'PAN' Button (good for BCF2000)
    if (msg.note == 45 && msg.velocity == 127) {//Off All Exec = 'INST' Button (good for X-Touch)
        if (clear_button == 1) {
          client.send('{"command":"Off Page Thru","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
          //client.send('{"command":"Exec *.* At zero","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
      }
    
    // Wing select
    if (msg.note == buttonWing0 && msg.velocity == 127) {//wing 0 = Core Fader
        if (wing == 1 || wing == 2) {
            wing = 0;
            output.send('noteon', { note: buttonWing0, velocity: 127, channel: 0 });
            output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });

            display7segWing (wing);
            displayLCD (7-1,secondRow,"       ");
            displayLCD (8-1,secondRow,"       ");
            
            //matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
			matrix = [ 105, 104, 103, 102, 101, 100, 0, 0, 205, 204, 203, 202, 201, 200, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];

        } else {
            ; //do nothing, already wing = 0;

        }
    }

    if (msg.note == buttonWing1 && msg.velocity == 127) {//wing 1
        if (wing == 0 || wing == 2) {
            wing = 1;
            output.send('noteon', { note: buttonWing0, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing1, velocity: 127, channel: 0 });
            output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });
            //matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
			matrix = [ 113, 112, 111, 110, 109, 108, 107, 106, 213, 212, 211, 210, 209, 208, 207, 206, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
			
        } else {
            wing = 0;
            output.send('noteon', { note: buttonWing0, velocity: 127, channel: 0 });
            output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });
            //matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
			matrix = [ 105, 104, 103, 102, 101, 100, 0, 0, 205, 204, 203, 202, 201, 200, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
			
            display7segWing (wing);
            displayLCD (7-1,secondRow,"       ");
            displayLCD (8-1,secondRow,"       ");
        }
        
        display7segWing (wing);
    }

    if (msg.note == buttonWing2 && msg.velocity == 127) {//wing 2  

        if (wing == 0 || wing == 1) {
            wing = 2;
            output.send('noteon', { note: buttonWing0, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing2, velocity: 127, channel: 0 });
            //matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
			matrix = [ 121, 120, 119, 118, 117, 116, 115, 114, 21, 221, 220, 219, 218, 217, 216, 215, 214, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
			
        } else {
            wing = 0;
            output.send('noteon', { note: buttonWing0, velocity: 127, channel: 0 });
            output.send('noteon', { note: buttonWing1, velocity: 0, channel: 0 });
            output.send('noteon', { note: buttonWing2, velocity: 0, channel: 0 });
            //matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
			matrix = [ 105, 104, 103, 102, 101, 100, 0, 0, 205, 204, 203, 202, 201, 200, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
			
            display7segWing (wing);
            displayLCD (7-1,secondRow,"       ");
            displayLCD (8-1,secondRow,"       ");
        }
        display7segWing (wing);
    }

    if (msg.note == buttonClear) {//  Clear     
        if (msg.velocity == 127) {
          clear_button = 1;
          output.send('noteon', { note: buttonClear, velocity: 1, channel: 0 });
          client.send('{"command":"Clear","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else {
          clear_button = 0;
          output.send('noteon', { note: buttonClear, velocity: 0, channel: 0 });
        }
    }

    //page select < (page-)
    if (msg.note == 46 && msg.velocity == 127 || msg.note == 48 && msg.velocity == 127 || msg.note == 70 && msg.velocity == 127) {//page select < (page-)
        output.send('cc', { controller: pageIndex + 48, value: 0, channel: 0 }); 
        output.send('cc', { controller: 51, value: 33, channel: 0 });//led speedmaster 1
        output.send('cc', { controller: 52, value: 34, channel: 0 });//led speedmaster 2
        output.send('cc', { controller: 53, value: 35, channel: 0 });//led speedmaster 3
        output.send('cc', { controller: 54, value: 36, channel: 0 });//led speedmaster 4
        pageIndex--;
        if (pageIndex < 0) {
            pageIndex = 0;
        }

        display7segPage (pageIndex);

        // Show Page on Encoder-LEDs, Page 1 = Encoder 1, Page 2 = Encoder 1, and so on
        output.send('cc', { controller: pageIndex + 48, value: 54, channel: 0 });
        if (page_sw == 1) {
            client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    //page select > (page+)
    if (msg.note == 47 && msg.velocity == 127 ||  // Button 'BANK>'
        msg.note == 49 && msg.velocity == 127 ||  // Button 'CHANNEL>'
        msg.note == 71 && msg.velocity == 127)    // Button 'OPTION'
    {  
        // Reset Old-Page-Displays
        output.send('cc', { controller: pageIndex + 48, value: 0, channel: 0 });
        output.send('cc', { controller: 51, value: 33, channel: 0 });//led speedmaster 1
        output.send('cc', { controller: 52, value: 34, channel: 0 });//led speedmaster 2
        output.send('cc', { controller: 53, value: 35, channel: 0 });//led speedmaster 3
        output.send('cc', { controller: 54, value: 36, channel: 0 });//led speedmaster 4
        pageIndex++;
        if (pageIndex > 6) { // use 0-6 => Page 1-7, maximum is Page 7
            pageIndex = 6;
        }
		
        display7segPage (pageIndex);

		// Show Page on Encoder-LEDs, Page 1 = Encoder 1, Page 2 = Encoder 1, and so on
        output.send('cc', { controller: pageIndex + 48, value: 54, channel: 0 });
        if (page_sw == 1) {
            client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }


    //encoder click 32-39 
    //old page select
	
    /*
    if (31 < msg.note && msg.note < 40) {
      for (controller = 48; controller <= 55; controller++) {
        output.send('cc', { controller: controller, value: 0, channel: 0 });
      }
      output.send('cc', { controller: ((msg.note) + 16), value: 54, channel: 0 });
      pageIndex = msg.note - 32;
    
    }
    */


    if (msg.note == buttonExecViewTop && msg.velocity == 127) {//top
        executors_view = 1;
        output.send('noteon', { note: buttonExecViewTop, velocity: 127, channel: 0 });//top
        output.send('noteon', { note: buttonExecViewBottom, velocity: 0, channel: 0 });//bottom
        display7segExecView (executors_view);
    }

    if (msg.note == 92 && msg.velocity == 127) {//exec time toggle
        client.send('{"command":"DefGoBack","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == buttonExecViewBottom && msg.velocity == 127) {//bottom 
        executors_view = 0;
        output.send('noteon', { note: buttonExecViewTop, velocity: 0, channel: 0 });//top
        output.send('noteon', { note: buttonExecViewBottom, velocity: 127, channel: 0 });//bottom
        display7segExecView (executors_view);
    }

    if (msg.note == 94 && msg.velocity == 127) {//prog time toggle
        client.send('{"command":"DefGoForward","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

});





//WEBSOCKET-------------------

client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');
    setInterval(interval, 80);
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
};

client.onclose = function () {
    console.log('Client Closed');
    setInterval(interval, 0);
    for (i = 0; i <= 127; i++) {
        output.send('noteon', { note: i, velocity: 0, channel: 0 });
        sleep(10, function () { });
    }

    for (i = 0; i <= 127; i++) {
        output.send('cc', { controller: i, value: 55, channel: 0 });
        sleep(10, function () { });
    }


    for (i = 0; i <= 7; i++) {
        output.send('pitch', { value: 0, channel: i });
        sleep(10, function () { });
    }


    input.close();
    output.close();
    process.exit();
};

client.onmessage = function (e) {



    request = request + 1;

    if (request > 9) {
        client.send('{"session":' + sessionnr + '}');

        client.send('{"requestType":"getdata","data":"set","session":' + sessionnr + ',"maxRequests":1}');

        request = 1;
    }


    if (typeof e.data === 'string') {
        // JSON-Daten
		//console.log("Received: '" + e.data + "'");
        //console.log("-----------------");
        //console.log(e.data);

        if (debugFile){
            if (fsWritten==0){
                if (fs.existsSync ("#websocket.txt")){
                    ; // do nothing?
                    if (fsDelete) {
                        fs.unlinkSync('#websocket.txt');
                        fsDelete = false;
                    }
                    fs.writeFile('#websocket.txt', '\n\n'+ e.data, { flag: 'a+' }, err => {});
                }    
                else {
                    fs.writeFile('#websocket.txt', '\n\n'+ e.data, { flag: 'a+' }, err => {});
                    fsWritten = 1;
                }
            }
        }
        
        obj = JSON.parse(e.data);


        if (obj.status == "server ready") {
            client.send('{"session":0}')
        }
        if (obj.forceLogin === true) {
            sessionnr = (obj.session);
            client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.session) {
            sessionnr = (obj.session);
        }


        if (obj.responseType == "login" && obj.result === true) {
            if (interval_on == 0) {
                interval_on = 1;
                setInterval(interval, 100);//80
            }
            console.log("...LOGGED");
            console.log("SESSION " + sessionnr);
            if (page_sw == 1) {
                client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            }
            //client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }


        if (obj.responseType == "getdata") {
            //"data":[{"set":"0"}],"worldIndex":0}){
        }


        // ********************************************************************************************
        // ********************************************************************************************
        // ********************************************************************************************
        if (obj.responseType == "playbacks") {//recive data from dot & set to X-Touch


            if (obj.itemGroups[0].items[0][0].iExec == 0) {
                var channel = 5;
                var exec = 6;
                output.send('pitch', { value: fader7_val, channel: 6 });
                output.send('pitch', { value: fader8_val, channel: 7 });
                output.send('noteon', { note: 6, velocity: 0, channel: 0 });
                output.send('noteon', { note: 7, velocity: 0, channel: 0 });
                output.send('noteon', { note: 14, velocity: 0, channel: 0 });
                output.send('noteon', { note: 15, velocity: 0, channel: 0 });
                output.send('noteon', { note: 22, velocity: 0, channel: 0 });
                output.send('noteon', { note: 23, velocity: 0, channel: 0 });
                output.send('noteon', { note: 30, velocity: 0, channel: 0 });
                output.send('noteon', { note: 31, velocity: 0, channel: 0 }); //60 61 68 69
            } else {
                var channel = 7;
                var exec = 8;
            }


            // --------------------------------------------------------
            for (var i = 0; i < exec; i++) { // Button-LEDs + Faders
                if (executors_view == 0) {
                    output.send('noteon', { note: ((channel)+0), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel)+8), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
                    output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[0].items[i][0].isRun)), channel: 0 });//executor fader bottom 1
                    output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[0].items[i][0].isRun) * 127), channel: 0 });//executor fader bottom 0
                } else {
                    output.send('noteon', { note: ((channel)+8), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel)+0), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
                    output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top

                }
                
				// Faders
				var value = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v); // fader
                valueText = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.vt); // fader-Text (mostly value)
                if (value == 1) { value = 16368; }
                else if (value === 0) { ; }
                else {
                    value = (value / 0.0000625) + 134;
                    
                }
                output.send('pitch', { value: (value), channel: (channel) });
                channel--;
				
				
				// -----------
				// Text-labels  ToDo für X-Touch
				// -----------
				
				// obj.itemGroups[2].items[i][0].isRun
				var Label = (obj.itemGroups[0].items[i][0].tt.t); // Label des Executors
                //var Label = ValueText;
                if (Object.keys(Label).length == 0){
                    Label = "";
                }
                if      (Label == "Master Speed 1") Label = "MSpeed1";
                else if (Label == "Master Speed 2") Label = "MSpeed2";
                else if (Label == "Master Speed 3") Label = "MSpeed3";
                else if (Label == "Master Speed 4") Label = "MSpeed4";
                //console.log("label...: "+Label);

				//Bits = 0b10101001;
						

				deviceID  = 0x14; // MCU = X-Touch (Full Size)
                lcdNumber = exec-i-1;
				//text = 'Test';
                text = Label.toString();
				//console.log("text....: "+text);
				
                // Send Text
                displayLCD(lcdNumber,secondRow,text);
                if (secondRow == 0 && valueText > "") { // display Valuetext of Fader
                    displayLCD(lcdNumber, 1, valueText);
                }

            }
        }
    }
}

// Show Executor-View on Assignment-7segment-LEDs
function display7segExecView (execView){
    output.send('cc', { controller: 0x49, value: 0x45, channel: 0 }); // E
    //output.send('cc', { controller: 0x48, value: 0x56, channel: 0 }); // V
    output.send('cc', { controller: 0x48, value: execView+0x30, channel: 0 }); //ExecView-Nr
    output.send('cc', { controller: 0x47, value: 0x20, channel: 0 }); // _
}

// Show Page on Assignment-7segment-LEDs
function display7segPage (page){
    output.send('cc', { controller: 0x4b, value: 0x50, channel: 0 });        // 0x50 = P.
    output.send('cc', { controller: 0x4a, value: page + 49, channel: 0 });   // PageNumber
}

// Show Core/Wing on Assignment-7segment-LEDs
function display7segWing (wing){
    
    if (wing == 0){
        // Show Core/Wing on Assignment-7segment-LEDs
        output.send('cc', { controller: 0x46, value: 0x43, channel: 0 }); // C
        output.send('cc', { controller: 0x45, value: 0x4f, channel: 0 }); // O
        output.send('cc', { controller: 0x44, value: 0x52, channel: 0 }); // R
        output.send('cc', { controller: 0x43, value: 0x45, channel: 0 }); // E
    }
    else {
        output.send('cc', { controller: 0x46, value: 0x57, channel: 0 }); // W
        output.send('cc', { controller: 0x45, value: 0x49, channel: 0 }); // I
        output.send('cc', { controller: 0x44, value: 0x4e, channel: 0 }); // N
        output.send('cc', { controller: 0x43, value: 0x47, channel: 0 }); // G
    }
    output.send('cc', { controller: 0x42, value: 0x20, channel: 0 }); // _
    output.send('cc', { controller: 0x41, value: wing+0x30, channel: 0 }); // WingNumber
    output.send('cc', { controller: 0x40, value: 0x20, channel: 0 }); // _
}

//Display Text on LCDs
function displayLCD(lcdNum, rowNum, text){

    // https://github.com/NicoG60/TouchMCU/blob/main/doc/mackie_control_protocol.md
    // send LCD - Displays
    
    if (text.length < 7){
        for (var l = 7; l < text.length; l--) text = text + " ";
    }
    var text7digit = text.substr(0,7);
    output.send('sysex',[
        0xf0, 
        // Header
        0x00, 0x00, 0x66, 	// 3-byte Manufacturer ID for Mackie Designs
        0x14, 				/*deviceID*/
        // Command
        0x12,      // Update LCD
        // Parameters
        lcdNum*7+(rowNum*8*7), 	// Position 0x00 =  0 = 1.LCD top, 
                        //          0x07 =  7 = 2.LCD top,
                        //          0x0e = 14 = 3.LCD top,
                        //          0x15 = 21 = 5.LCD top,
                        //          0x1c = 28 = 6.LCD top,
                        //          0x23 = 35 = 7.LCD top,
                        //          0x2a = 42 = 8.LCD top,
                        //          0x31 = 49 = 1.LCD bottom,
                        //          0x38 = 56 = 2.LCD bottom,
                        //          0x3f = 63 = 3.LCD bottom,
                        //          0x46 = 70 = 4.LCD bottom,
                        //          0x4d = 77 = 5.LCD bottom,
                        //          0x54 = 84 = 6.LCD bottom,
                        //          0x5b = 91 = 7.LCD bottom,
                        //          0x62 = 98 = 8.LCD bottom,
        text7digit.charCodeAt(0), 
        text7digit.charCodeAt(1),
        text7digit.charCodeAt(2),
        text7digit.charCodeAt(3),
        text7digit.charCodeAt(4),
        text7digit.charCodeAt(5),
        text7digit.charCodeAt(6), // maximal 127 digits/sysex, 8th digit is on next LCD like Position
        // End
        0xf7
    ]);
}

//sleep function
function sleep(time, callback) {
    var stop = new Date()
        .getTime();
    while (new Date()
        .getTime() < stop + time) {
        ;
    }
    callback();
}

