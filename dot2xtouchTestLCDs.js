//dot2bcf2000 v 1.4.1 by ArtGateOne

var easymidi = require('easymidi');
var W3CWebSocket = require('websocket')
    .w3cwebsocket;
var client = new W3CWebSocket('ws://localhost:80/'); //U can change localhost(127.0.0.1) to Your console IP address


//config
// var midi_in = 'loopMIDI';      //set correct midi in device name
// var midi_out = 'loopMIDI';     //set correct midi out device name
var midi_in = 'X-Touch';      //set correct midi in device name
var midi_out = 'X-Touch';     //set correct midi out device name
var page_sw = 1;              //Auto Page switch on dot2  1 = ON, 0 = OFF
var blackout_toggle_mode = 0; //BlackOut toggle mode    1 = ON, 0 = OFF
var executors_view = 0;       //default executors view/control   0 = bottom, 1 = top
var wing = 0;                 //default core = 0, f-wing 1 or 2

var fader7 = "1.1";     //Core fader L SpecialMaster nr
var fader8 = "1.2";     //Core fader R SpecialMaster nr

var fader7_val = 16368; //default fader position for core L master fader
var fader8_val = 0;     //default fader position for core R master fader

//Uncoment when u wan use fader 8 as Grand Master in CORE
//fader8 = "2.1";
//fader8_val = 16368;

//----------------------------------------------------------------------------------------------

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
var count = 0;


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
console.log("     X-Touch LCD TEST     ");
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

function interval() {
  
	//******************************************************************************
	
	// https://github.com/NicoG60/TouchMCU/blob/main/doc/mackie_control_protocol.md
	// send LCD - Displays TEST

	deviceID  = 0x14; // MCU = X-Touch (Full Size)
	lcdNumber = 0;
	output.send('sysex',[
		0xf0, 
		// Header
		0x00, 0x00, 0x66, 	// 3-byte Manufacturer ID for Mackie Designs
		0x14, 				/*deviceID*/
		// Command
		0x12,      // Update LCD
		// Parameters
		0x0e, 		// Position 0x00 =  0 = 1.LCD top, 
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
		0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,  // 7x ASCII
		0x32, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,  // 7x ASCII* -> next LCD
		0x32, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,  // 7x ASCII* -> next LCD
		0x32, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,  // 7x ASCII* -> next LCD
		// End
		0xf7
	]);
					
  
}




//send wing led status 
if (wing == 1) {
    output.send('noteon', { note: 43, velocity: 127, channel: 0 });
    output.send('noteon', { note: 44, velocity: 0, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 }); 
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    //matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
	matrix = [ 113, 112, 111, 110, 109, 108, 107, 106, 213, 212, 211, 210, 209, 208, 207, 206, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
	
} else if (wing == 2) {
    output.send('noteon', { note: 43, velocity: 0, channel: 0 });
    output.send('noteon', { note: 44, velocity: 127, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    //matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
	matrix = [ 121, 120, 119, 118, 117, 116, 115, 114, 221, 220, 219, 218, 217, 216, 215, 214, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
	
} else if (wing == 0) {
    output.send('noteon', { note: 43, velocity: 0, channel: 0 });
    output.send('noteon', { note: 44, velocity: 0, channel: 0 });
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
output.send('noteon', { note: 42, velocity: 0, channel: 0 });//led PANS     - OFF EDIT key
output.send('noteon', { note: 45, velocity: 3, channel: 0 });//led INST     - clear blink
output.send('cc', { controller: 48, value: 63, channel: 0 });//led LEDsEnc1 - page 1
output.send('cc', { controller: 51, value: 33, channel: 0 });//led LEDsEnc4 - speedmaster 1: 1/12 LED
output.send('cc', { controller: 52, value: 34, channel: 0 });//led LEDsEnc5 - speedmaster 2: 2/12 LEDs
output.send('cc', { controller: 53, value: 35, channel: 0 });//led LEDsEnc6 - speedmaster 3: 3/12 LEDs
output.send('cc', { controller: 54, value: 36, channel: 0 });//led LEDsEnc7 - speedmaster 4: 4/12 LEDs
output.send('cc', { controller: 55, value: 54, channel: 0 });//led LEDsEnc8 - grandmaster:  11/12 LEDs
//output.send('sysex',[0xf0, 0x00, 0x00, 0x66, 0x05, 0x00, 0x10, 0x00, 0x00, 0x00, 0x31, 0x33, 0xf7]);
if (executors_view == 1) {//executors view
    output.send('noteon', { note: 91, velocity: 127, channel: 0 });//top
    output.send('noteon', { note: 93, velocity: 0, channel: 0 });//bottom
} else {
    output.send('noteon', { note: 91, velocity: 0, channel: 0 });//top
    output.send('noteon', { note: 93, velocity: 127, channel: 0 });//bottom
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

