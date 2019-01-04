import { Component, OnInit, ViewChild, Input, OnChanges, ElementRef } from '@angular/core';

// declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

import * as PIXI from 'pixi.js/dist/pixi.min.js';

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
	// defines the words to come (next) and words already played (previous)
	private pTexts: PIXI.Text[] = [];
	private width: number = 500;
	private height: number = 100;
  private wordSpacing: number = 5;
	private isPlaying: boolean = false;
	private startTime: number;

  constructor() { }

  ngOnInit() {
  	let width: number = this.width;
  	let height: number = this.height;
  	
  	this.pApp = new PIXI.Application({ width: width, height: height }); // this creates our pixi application
  	let background: PIXI.Graphics = new PIXI.Graphics();
  	background.lineStyle(2, 0x888888).beginFill(0x441155)
 		.drawRect(0, 0, width, height).endFill();
 		background.cacheAsBitmap = true;
 		this.pApp.stage.addChild(background);

		this.pixiContainer.nativeElement.appendChild(this.pApp.view); // this places our pixi application onto the viewable document

		// setup a container for the text(s), three for the words to come, three for the words already defined
		let rval: number = Math.floor(0.9 * 0xff);
		let gval: number = Math.floor(0.9 * 0xff);
		let bval: number = Math.floor(0.9 * 0xff);
		let color: number = rval * 0x010000 + gval * 0x000100 + bval * 0x000001;
		console.log(rval, gval, bval, color);
		for (let i = 0; i < 10; i++){
			let fontSize = 20;
			let pText = new PIXI.Text("", {fontSize: fontSize, fill: color});
			pText.y = height/2 - fontSize/2;
			this.pApp.stage.addChild(pText);
			this.pTexts.push(pText);
		}

		// setup background display (moving bars to represent timing)
		let timeBar:PIXI.Graphics = new PIXI.Graphics();
		timeBar.lineStyle(1, 0x8899bb).beginFill(0x556699)
 		.drawRect(-1, -height/2, 2, height).endFill();
 		timeBar.cacheAsBitmap = true;
 		timeBar.x = width/2;
 		timeBar.y = height/2;
 		this.pApp.stage.addChild(timeBar);

 		let timeBars:PIXI.Graphics = new PIXI.Graphics();
 		timeBars.beginFill(0xcc99aa);
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

  onStop() {
  	this.isPlaying = false;
  	this.clearPTexts();
  }


  createNewSync() {
  	if (this.pApp != null && this.transcript.length > 0) {
  		this.index = 0;
  		console.log(this.transcript);
  		this.startTime =	(new Date()).getTime();
  		this.isPlaying = true;
  		this.defineCurrentPTexts();		  
		}
  }

  advanceSync() {
  	if (this.isPlaying && this.index < this.transcript.length) {
  		this.transcript.setTimeAt(this.index, (new Date()).getTime() - this.startTime);
  		this.shiftPTexts();
	  }
  }

  playCurrentSync() {
  	if (this.pApp != null && this.transcript.length > 0) {
  		this.index = 0;
  		this.startTime =	(new Date()).getTime();
  		this.isPlaying = true;
  		this.defineCurrentPTexts();
  		this.advanceCurrentSync();
		}
  }  

  advanceCurrentSync() {
  	if (this.isPlaying && this.index < this.transcript.length) {
  		let time = this.transcript.getTimeAt(this.index) - (this.index > 0 ? this.transcript.getTimeAt(this.index-1) : 0);
		  console.log("time", time);
		  setTimeout(() => {
		  	this.shiftPTexts();
		  	this.advanceCurrentSync();
		  }, time);  		
	  }
  }

  shiftPTexts() {
  	if (this.pApp != null && this.transcript.length > 0) {
  		++this.index;
  		// remove the first pText (on the left), change its word, then push it back on the back
  		let index: number = this.index + this.pTexts.length / 2 - 1;
  		let pText: PIXI.Text = this.pTexts.shift();
  		pText.text = this.transcript.getWordAt(index);
  		console.log("new word:", this.transcript.getWordAt(index), "at index", index);
  		this.pTexts.push(pText);
  		
  		// half of the words *could* be on the left side (*if we have already advanced through those words). 
  		// For such words we need to work backwards for positioning
  		let curX: number = this.width/2 - 20;
			for (let i = this.pTexts.length / 2 - 1; i >= 0; i--){
  			curX -= this.pTexts[i].width + this.wordSpacing;
				this.pTexts[i].x = curX; 
				this.pTexts[i].style.fill = 0x888888;
  		}
			
			// everything at or after the index should be on the right side  		
			curX = this.width/2 + 20;
			for (let i = this.pTexts.length / 2; i < this.pTexts.length; i++){
  			this.pTexts[i].x = curX; 
  			curX += this.pTexts[i].width + this.wordSpacing;
        if (i == this.pTexts.length / 2){
          this.pTexts[i].style.fill = 0xffffff;  
        } else {
          this.pTexts[i].style.fill = 0xaaaaaa;
        }
  			
			}
  	}
  }

  defineCurrentPTexts(): void {
  	if (this.pApp != null && this.transcript.length > 0) {
  		// half of the words *could* be on the left side, if we have already progressed through 
  		// those words. For such words we need to work backwards for positioning
  		let curX: number;
  		if (this.index - 1 >= 0) {
  			curX = this.width/2 - 20;
  			for (let i = this.pTexts.length / 2 - 1; i >= 0; i--){
	  			let word: string = this.transcript.getWordAt(this.index - (this.pTexts.length / 2 - i));
	  			this.pTexts[i].text = word;
	  			curX -= this.pTexts[i].width + this.wordSpacing;
  				this.pTexts[i].x = curX; 
  				this.pTexts[i].style.fill = 0x888888;
	  		}
	  	}
			
			// everything at or after the index should be on the right side  		
  		
  		if (this.index < this.pTexts.length) {
  			curX = this.width/2 + 20;
  			for (let i = this.pTexts.length / 2; i < this.pTexts.length; i++){
	  			let word: string = this.transcript.getWordAt(this.index + (i - this.pTexts.length / 2));
	  			this.pTexts[i].text = word;
	  			this.pTexts[i].x = curX; 
	  			curX += this.pTexts[i].width + this.wordSpacing;
	  			if (i == this.pTexts.length / 2){
            this.pTexts[i].style.fill = 0xffffff;  
          } else {
            this.pTexts[i].style.fill = 0xaaaaaa;
          }
  			}
  		}
  	}
  }

  clearPTexts(): void {
  	for (let i = 0; i < this.pTexts.length; i++){
  		this.pTexts[i].text = "";
  	}
  } 
}
