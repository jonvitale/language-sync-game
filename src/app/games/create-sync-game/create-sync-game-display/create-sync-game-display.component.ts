import { Component, OnInit, ViewChild, Input, OnChanges, ElementRef } from '@angular/core';

declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

import { Transcript } from '../../../shared/Transcript';

@Component({
  selector: 'app-create-sync-game-display',
  templateUrl: './create-sync-game-display.component.html',
  styleUrls: ['./create-sync-game-display.component.css']
})
export class CreateSyncGameDisplayComponent implements OnInit {

	@Input() transcript: Transcript;
	@ViewChild('pixiContainer') pixiContainer: ElementRef; // this allows us to reference and load stuff into the div container
	private pApp: PIXI.Application;
	private index: number = 0;
	private pText: PIXI.Text;
	// defines the words to come (next) and words already played (previous)
	private pTextsNext: PIXI.Text[] = [];
	private pTextsPrevious: PIXI.Text[] = [];
	private width: number = 500;
	private height: number = 100;
	private isPlaying: boolean = false;
	private startTime: number;

  constructor() { }

  ngOnInit() {
  	let width: number = this.width;
  	let height: number = this.height;
  	
  	this.pApp = new PIXI.Application({ width: width, height: height, backgroundColor: 0xbafff7 }); // this creates our pixi application

		this.pixiContainer.nativeElement.appendChild(this.pApp.view); // this places our pixi application onto the viewable document

		// setup a container for the text(s), three for the words to come, three for the words already defined
		for (let i = 0; i < 5; i++){
			let pText = new PIXI.Text("", {fontSize: 20, fill: '#888888'});
			pText.y = height/2 - 5;
			this.pApp.stage.addChild(pText);
			this.pTextsNext.push(pText);
		}
		for (let i = 0; i < 5; i++){
			let pText = new PIXI.Text("", {fontSize: 20, fill: '#888888'});
			pText.y = height/2 - 5;
			this.pApp.stage.addChild(pText);
			this.pTextsPrevious.push(pText);
		}

		// this.pText = new PIXI.Text("");
	 //  this.pApp.stage.addChild(this.pText);

		// setup background display (moving bars to represent timing)
		let timeBar:PIXI.Graphics = new PIXI.Graphics();
 		timeBar.lineStyle(1, 0x8899bb).beginFill(0x556699)
 		.drawRect(-1, -height/2, 2, height).endFill();
 		timeBar.x = width/2;
 		timeBar.y = height/2;
 		this.pApp.stage.addChild(timeBar);

 		let timeBars:PIXI.Graphics = new PIXI.Graphics();
 		timeBars.beginFill(0x99aacc);
 		for (let i = 0; i < 5; i++){
 			timeBars.drawRect(-1 + i * width/5, 0, 2, height);
 		}
 		timeBars.endFill();
 		this.pApp.stage.addChild(timeBars);
 		timeBars.x = width/5;
    
    this.pApp.ticker.add(() => {
    	if (this.isPlaying){
	    	timeBars.x --;
	    	if (timeBars.x < 0){
	    		timeBars.x = width/5;
	    	}
	    }
    })
  }

  ngOnChanges() {  	
  }

  onPlay(setTiming: boolean) {
  	if (this.pApp != null && this.transcript.length > 0) {
  		console.log(this.transcript);
  		this.startTime =	(new Date()).getTime();
  		this.isPlaying = true;
  		if (setTiming){
	  		this.defineCurrentPTexts();
		  } else {
		  	let time = this.transcript.getTimeAt(0);
		  	console.log("time", time);
		  	setTimeout(() => {
		  		this.defineCurrentPTexts();
		  	}, time);
		  }
		}
  }

  onStop() {
  	this.isPlaying = false;
  	this.pText.text = '';
  }

  onSyncAction() {
  	if (this.isPlaying && this.index < (this.transcript.length-1)) {
  		this.transcript.setTimeAt(this.index, (new Date()).getTime() - this.startTime);
  		++this.index;
  		this.defineCurrentPTexts();
	  }
  }


  defineCurrentPTexts() {
  	if (this.pApp != null && this.transcript.length > 0) {
  		// what words have already been defined
  		let pindex = this.index - 1;
  		let curX = this.width/2 - 20;
  		while (pindex >= 0 && (this.index - pindex - 1) >= 0) {
  			let word: string = this.transcript.getWordAt(pindex);
  			this.pTextsPrevious[this.index - pindex - 1].text = word;
  			curX -= this.pTextsNext[pindex].width + 2;
  			this.pTextsPrevious[this.index - pindex - 1].x = curX; 
  			
  			pindex--;
  		}

  		let nindex = this.index;
  		curX = this.width/2 + 20;
  		while (nindex < this.pTextsNext.length) {
  			let word: string = this.transcript.getWordAt(nindex);
  			this.pTextsNext[nindex].text = word;
  			this.pTextsNext[nindex].x = curX; 
  			curX += this.pTextsNext[nindex].width + 2;
  			nindex++;
  		}
  	}
  }
}
