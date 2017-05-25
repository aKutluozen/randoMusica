/*
	Coded by Ali Kutluozen
	Last modified: 5/20/2016
*/
function initialize() {
	randoMusica.setUp();
}
/*
	randoMusica class
	methods:
		setUp, generate, play, playSound, readMusic, soundLoaded, drawNotes, updateButtons
	*/
var randoMusica = {
	//Get the necessary elements
	musicCanvas : document.getElementById("musicCanvas"),
	context : musicCanvas.getContext("2d"),
	statusBar : document.getElementById("status"),
	playPauseButton : document.getElementById("playPause"),
	speed : document.getElementById("uniqueID"),
	musicBoard : document.getElementById("musicBoard"),

	//Define the colors
	noteHighBackground : "rgba(255, 204, 0, 0.5)",
	noteHighForeground : "rgba(255, 153, 51, 1)",
	noteLowBackground : "rgba(204, 255, 102, 0.5)",
	noteLowForeground : "rgba(153, 204, 100, 1)",
	statusPlayColor : "background: rgb(112, 219, 112); transition: 0.75s; box-shadow: 0px 0px 24px rgb(112, 219, 112);",
	statusPauseColor : "background: rgb(255, 153, 51); transition: 0.75s; box-shadow: 0px 0px 24px rgb(255, 153, 51);",
	statusGenerateColor : "background: rgb(51, 153, 255); transition: 0.75s; box-shadow: 0px 0px 24px rgb(51, 153, 255);",
	statusStopColor : "background: rgb(204, 51, 0); transition: 0.75s; box-shadow: 0px 0px 24px rgb(204, 51, 0);",
	notesRead : "rgba(102, 153, 255, 0.5)",

	//Define status'
	statusPlaying : "Status: PLAYING",
	statusPaused : "Status: PAUSED",
	statusGenerated : "Status: GENERATED",
	statusError : "Status: ERROR - NO MUSIC GENERATED YET!",
	
	//Other variables
	rows : 12, columns : 512, //Size of a music board
	boxSizeOut : 10, boxSizeIn : 8, //For the graphics
	noteCounter : 0, //Iterates through the notes
	interval : 0,

	//Music board arrays
	musicArrayHigh : new Array(this.columns),
	musicArrayLow : new Array(this.columns),

	//Main loop control
	isPlaying : false,
	isGenerated : false,
	
	//Sets up the music array, audio engine and loads the sounds
	setUp : function() {
		for(var i = 0; i < this.columns; i++){
			this.musicArrayHigh[i] = new Array(this.rows);
			this.musicArrayLow[i] = new Array(this.rows);
		}
		
		if (!createjs.Sound.initializeDefaultPlugins()) {
			document.getElementById("error").style.display = "block";
			document.getElementById("content").style.display = "none";
			return;
		}

		var assetsPath = "audio/";
		var sounds = [
			{src: "C.ogg", id: 12},
			{src: "B.ogg", id: 11},
			{src: "Bb.ogg", id: 10},
			{src: "A.ogg", id: 9},
			{src: "Ab.ogg", id: 8},
			{src: "G.ogg", id: 7},
			{src: "Fs.ogg", id: 6},
			{src: "F.ogg", id: 5},
			{src: "E.ogg", id: 4},
			{src: "Eb.ogg", id: 3},
			{src: "D.ogg", id: 2},
			{src: "Cs.ogg", id: 1},
			{src: "C2.ogg", id: 0},
			{src: "B2.ogg", id: 23},
			{src: "Bb2.ogg", id: 22},
			{src: "A2.ogg", id: 21},
			{src: "Ab2.ogg", id: 20},
			{src: "G2.ogg", id: 19},
			{src: "Fs2.ogg", id: 18},
			{src: "F2.ogg", id: 17},
			{src: "E2.ogg", id: 16},
			{src: "Eb2.ogg", id: 15},
			{src: "D2.ogg", id: 14},
			{src: "Cs2.ogg", id: 13},
		];

		createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));
		createjs.Sound.registerSounds(sounds, assetsPath);
	},

	//Generates random music based on the C major scale.
	generate : function() {
		this.isGenerated = true;
		this.isPlaying = false;
		this.updateButtons();
		this.noteCounter = 0;
		clearInterval(this.interval);
		this.statusBar.style = this.statusGenerateColor;
		this.statusBar.innerHTML = this.statusGenerated;
		this.musicBoard.scrollLeft = this.noteCounter * this.boxSizeOut;
		//Reset the music array
		for(var i = 0; i < this.columns; i++){
			for(var j = 0; j < this.rows; j++){
				this.musicArrayHigh[i][j] = 0;
				this.musicArrayLow[i][j] = 0;
			}
		}		
		//Populate the arrays with random notes on C Major Scale - FOR NOW
		for(var jump = 0; jump < 512; jump += 32){
			for(var i = jump; i < jump+24; i++){
				var noteHigh = Math.floor((Math.random() * 12) + 0);
				if(noteHigh === 0 || noteHigh === 2 || noteHigh === 4 || noteHigh === 5 || noteHigh === 7 || noteHigh === 9 || noteHigh === 11){
					this.musicArrayHigh[i][noteHigh] = 1;
				}
				var noteLow = Math.floor((Math.random() * 12) + 0);
				if(noteLow === 0 || noteLow === 2 || noteLow === 4 || noteLow === 5 || noteLow === 7 || noteLow === 9 || noteLow === 11){
					this.musicArrayLow[i][noteLow] = 1;
				}
			}
			//Repeat the last 8 notes
			for(var i = jump+24; i < jump+30; i++){
				for(var j = 0; j < this.rows; j++){
					this.musicArrayHigh[i][j] = this.musicArrayHigh[i-8][j];
					this.musicArrayLow[i][j] = this.musicArrayLow[i-8][j];
				}
			}
		}
		this.drawNotes();
	},
	
	//Sets the button swtiches and calls the readMusic function
	play : function() {
		if(!this.isGenerated){
			this.statusBar.style = this.statusStopColor;
			this.statusBar.innerHTML = this.statusError;
		} else { 
			this.isPlaying = !this.isPlaying;	
			this.updateButtons();
			if(this.isPlaying){
				if(this.interval > 0){
					clearInterval(this.interval);
				}
				this.interval = setInterval( function() { randoMusica.readMusic(); }, this.speed.value );
			} else {
				clearInterval(this.interval);
			}	
		}
	},
	
	//Helps the initialization
	soundLoaded : function(event) {
		var div = document.getElementById(event.id);
	},

	//Plays the given note id
	playSound : function(id) {
		//Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
		var instance = createjs.Sound.play(id);
		if(id > 12) {
			instance.volume = 0.5; // Volume down for lower notes
		}
		if (instance === null || instance.playState === createjs.Sound.PLAY_FAILED) {
			return;
		}
	},
	
	//Reads the appropriate notes based on what is read from the music array
	readMusic : function() {
		for(var i = 0; i < this.rows; i++){
			if(this.musicArrayHigh[this.noteCounter][i] === 1)
				this.playSound(i);
			if(this.musicArrayLow[this.noteCounter][i] === 1){
				switch(i){
					case 0: this.playSound(0); this.playSound(16); break;
					case 2: this.playSound(14); this.playSound(17); break;
					case 4: this.playSound(16); this.playSound(19); break;
					case 5: this.playSound(17); this.playSound(21); break;
					case 7: this.playSound(19); this.playSound(23); break;
					case 9: this.playSound(21); this.playSound(0); break;
					case 11: this.playSound(23); this.playSound(14); break;
					default: this.playSound(0); break;
				}
			}
		}
		this.noteCounter++;	
		this.musicBoard.scrollLeft = this.noteCounter * this.boxSizeOut;
	},
	
	//Updates the colors and texts of the buttons
	updateButtons : function() {
		if(this.isPlaying){
			this.statusBar.style = this.statusPlayColor;
			this.statusBar.innerHTML = this.statusPlaying;
			this.playPauseButton.innerHTML = "Pause";
		} else {
			this.statusBar.style = this.statusPauseColor;
			this.statusBar.innerHTML = this.statusPaused;
			this.playPauseButton.innerHTML = "Play";
		}	
	},
	
	//Draws the notes based on what is on the music array 
	drawNotes : function() {
		this.context.clearRect(0, 0, this.columns * this.boxSizeOut, this.rows * this.boxSizeOut * 2);
		//Draw musicArrayHigh
		for(var i = 0; i < this.columns; i++){
			for(var j = 0; j < this.rows; j++){
				if(this.musicArrayHigh[i][j] === 0){
					this.context.fillStyle = this.noteHighBackground;
					this.context.fillRect(i*this.boxSizeOut, j*this.boxSizeOut, this.boxSizeIn, this.boxSizeIn);
				} 
				else if(this.musicArrayHigh[i][j] === 1){
					this.context.fillStyle = this.noteHighForeground;
					this.context.fillRect(i*this.boxSizeOut, j*this.boxSizeOut, this.boxSizeIn, this.boxSizeIn);
				} 
			}
		}
		//Draw musicArrayLow
		for(var i = 0; i < this.columns; i++){
			for(var j = 0; j < this.rows; j++){
				if(this.musicArrayLow[i][j] === 0){
					this.context.fillStyle = this.noteLowBackground;
					this.context.fillRect(i*this.boxSizeOut,this.boxSizeOut*this.rows + j*this.boxSizeOut, this.boxSizeIn, this.boxSizeIn);
				} 
				else if(this.musicArrayLow[i][j] === 1){
					this.context.fillStyle = this.noteLowForeground;
					this.context.fillRect(i*this.boxSizeOut, this.boxSizeOut*this.rows + j*this.boxSizeOut, this.boxSizeIn, this.boxSizeIn);
				} 
			}
		}
	}
}