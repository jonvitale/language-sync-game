import { Component, OnInit, OnDestroy, ViewChild, Input, Output,
	OnChanges, ElementRef, EventEmitter } from '@angular/core';

// declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

import * as PIXI from 'pixi.js/dist/pixi.min.js';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})
export class GameDisplayComponent implements OnInit, OnDestroy {

	@ViewChild('pixiContainer') pixiContainer: ElementRef; // this allows us to reference and load stuff into the div container
	@Input() activityType: string;
	public isPlaying: boolean = false;

	private pApp: PIXI.Application;
	private displayedLyrics: PIXI.Text[] = [];
	// private lyricsAddedToStage: boolean = false;
	private nWordsToDisplay: number = 10;
	private maxWordsOnLeft = Math.floor(this.nWordsToDisplay/2);
  private maxWordsOnRight = Math.ceil(this.nWordsToDisplay/2);
  	
	private lyrics: string[];
	private nextIndexInLyrics: number;
	private nextIndexInDisplay: number;
	private readonly width: number = 500;
	private readonly height: number = 100;
  private readonly wordSpacing: number = 5;
  private readonly fontSize: number = 20;
	
  constructor() { }

  ngOnInit() {
  	
  	/// visualization

  	this.pApp = new PIXI.Application({ width: this.width, height: this.height }); // this creates our pixi application
  	let background: PIXI.Graphics = new PIXI.Graphics();
  	background.lineStyle(2, 0x888888).beginFill(0x441155)
 		.drawRect(0, 0, this.width, this.height).endFill();
 		background.cacheAsBitmap = true;
 		this.pApp.stage.addChild(background);

		this.pixiContainer.nativeElement.appendChild(this.pApp.view); // this places our pixi application onto the viewable document

		// setup background display (moving bars to represent timing)
		let timeBar:PIXI.Graphics = new PIXI.Graphics();
		timeBar.lineStyle(1, 0x8899bb).beginFill(0x556699)
 		.drawRect(-1, -this.height/2, 2, this.height).endFill();
 		timeBar.cacheAsBitmap = true;
 		timeBar.x = this.width/2;
 		timeBar.y = this.height/2;
 		this.pApp.stage.addChild(timeBar);

 		let timeBars:PIXI.Graphics = new PIXI.Graphics();
 		timeBars.beginFill(0xcc99aa);
 		for (let i = 0; i < 5; i++){
 			timeBars.drawRect(-1 + i * this.width/5, 0, 2, this.height);
 		}
 		timeBars.endFill();
 		this.pApp.stage.addChild(timeBars);
 		timeBars.x = this.width/5;
    
    this.pApp.ticker.add(() => {
    	if (this.isPlaying){
	    	timeBars.x --;
	    	if (timeBars.x < 0){
	    		timeBars.x = this.width/5;
	    	}
	    }
    })
  }

  ngOnDestroy() {
  }

  initialize(lyrics: string[], nWordsToDisplay?: number, index?: number): void {
  	this.isPlaying = true;
  	this.lyrics = lyrics;
  	if (nWordsToDisplay) {
  		this.nWordsToDisplay = nWordsToDisplay;
  		this.maxWordsOnLeft = Math.floor(this.nWordsToDisplay/2);
  		this.maxWordsOnRight = Math.ceil(this.nWordsToDisplay/2);  
  	}
  	if (!index) {
  		this.nextIndexInLyrics = 0;
  	} else {
  		this.nextIndexInLyrics = index;
  	}
  	const nWordsOnLeft = Math.min(this.nextIndexInLyrics, this.maxWordsOnLeft);
  	const nWordsOnRight = Math.min(lyrics.length - this.nextIndexInLyrics, this.maxWordsOnRight);
  	this.nextIndexInDisplay = nWordsOnLeft;

  	// left
  	let xpos = this.width/2 - this.wordSpacing;
  	for (let offset = -1; offset >= -1 * nWordsOnLeft; offset--) {
  		xpos = this.addTextOnLeft(lyrics[this.nextIndexInLyrics + offset], xpos, offset);
			xpos -= this.wordSpacing;
  	}

  	// right
  	xpos = this.width/2 + this.wordSpacing;
  	for (let offset = 0; offset < nWordsOnRight; offset++) {
  	xpos = this.addTextOnRight(lyrics[this.nextIndexInLyrics + offset], xpos, offset);
			xpos += this.wordSpacing;	
		}
  }

  shiftLyrics() {
		if (this.nextIndexInLyrics >= this.lyrics.length) return;
  	
  	let lyrics = this.lyrics;
  	let nWordsOnLeft = Math.min(this.nextIndexInLyrics, this.maxWordsOnLeft);
  	let nWordsOnRight = Math.min(lyrics.length - this.nextIndexInLyrics, this.maxWordsOnRight);
  	
  	
  	// remove the first word on the left if we have a full left
  	if (nWordsOnLeft == this.maxWordsOnLeft) {  		
  		const shiftLyric: PIXI.Text = this.displayedLyrics.shift();		
  		this.pApp.stage.removeChild(shiftLyric);
  		// the object currently at the zero-position on the right shifts down an index
  		this.nextIndexInDisplay--;
  	} 

  	
  	// move one object from right to left
		let xpos = this.width/2 - this.wordSpacing;
  	let pText = this.displayedLyrics[this.nextIndexInDisplay];
		xpos = this.positionTextOnLeft(pText, xpos, -1);
		xpos -= this.wordSpacing;	
		// let nWordsOnLeft = 1;

		// move objects already on the left side further to the left  
		for (let offset = -1; offset >= -1 * nWordsOnLeft; offset--) {			
			let pText = this.displayedLyrics[this.nextIndexInDisplay + offset];
			xpos = this.positionTextOnLeft(pText, xpos, offset-1);
			xpos -= this.wordSpacing;	
  	}

  	
  	// shift words on right - first will go to left
  	xpos = this.width/2 + this.wordSpacing;
  	for (let offset = 1; offset < nWordsOnRight; offset++) {
  		pText = this.displayedLyrics[this.nextIndexInDisplay + offset];
			xpos = this.positionTextOnRight(pText, xpos, offset-1);
			xpos += this.wordSpacing;	
		}

		// add the next word to the right, if there are words left
		let nindex: number = this.nextIndexInLyrics + nWordsOnRight;
		if (nindex < this.lyrics.length) {
			this.addTextOnRight(this.lyrics[nindex], xpos, nWordsOnRight-1);	
		}
		this.nextIndexInLyrics++;
		this.nextIndexInDisplay++;
  }

  pause() {
  	this.isPlaying = false;
  }

  resume() {
  	this.isPlaying = true;
  }

  stop() {
  	this.isPlaying = false;
  	for (let i = 0; i < this.displayedLyrics.length; i++){
  		this.pApp.stage.removeChild(this.displayedLyrics[i]);
  	}
  	this.displayedLyrics = [];
  }

  private addTextOnLeft(word: string, xpos: number, offset: number): number {
  	if (offset < 0 && Math.abs(offset) <= Math.floor(this.nWordsToDisplay / 2)) {
			let pText = new PIXI.Text(word, {fontSize: this.fontSize, fill: 0x888888});
			// add this word to the front of the dislay list
			this.displayedLyrics.splice(0, 0, pText);	
			this.pApp.stage.addChild(pText);
			return (this.positionTextOnLeft(pText, xpos, offset));				
		} else {
			return null;
		}
  }

  private positionTextOnLeft(pText: PIXI.Text, xpos: number, offset: number) {
  	if (offset < 0 && Math.abs(offset) <= Math.floor(this.nWordsToDisplay / 2)) {
			pText.x = xpos - pText.width;	
			pText.y = this.height/2 - this.fontSize/2;	
			this.pApp.stage.addChild(pText);
			return (pText.x);				
		} else {
			return null;
		}
  }

  private addTextOnRight(word: string, xpos: number, offset: number): number {
  	const color: number = Math.floor(0.9 * 0xff) * 0x010000 
												+ Math.floor(0.9 * 0xff) * 0x000100 
												+ Math.floor(0.9 * 0xff) * 0x000001;
		if (offset >= 0 && offset < Math.ceil(this.nWordsToDisplay / 2)) {
			let pText = new PIXI.Text(word, {fontSize: this.fontSize, fill: color});
			this.displayedLyrics.push(pText);
			this.pApp.stage.addChild(pText);
			return this.positionTextOnRight(pText, xpos, offset);				
		} else {
			return null;
		}
  }

  private positionTextOnRight(pText: PIXI.Text, xpos: number, offset: number) {
  	if (offset >= 0 && offset < Math.floor(this.nWordsToDisplay / 2)) {
			pText.x = xpos;	
			pText.y = this.height/2 - this.fontSize/2;	
			return (pText.x + pText.width);				
		} else {
			return null;
		}
  }



  

  /*
  initializeLyrics(lyrics: string[], nWordsToDisplay?: number, index?: number): void {
  	this.lyrics = lyrics;
  	if (nWordsToDisplay) {
  		this.nWordsToDisplay = nWordsToDisplay;
  	}
  	if (!index) index = 0

  	// setup a container for the text(s), five for the words to come, five for the words already defined
		const color: number = Math.floor(0.9 * 0xff) * 0x010000 
												+ Math.floor(0.9 * 0xff) * 0x000100 
												+ Math.floor(0.9 * 0xff) * 0x000001;
		const this.fontSize: number = 20;
			
		this.displayedLyrics = [];
		// debugger;
		const nWordsOnLeft: number = Math.min(index, Math.floor(this.nWordsToDisplay / 2));
		const nWordsOnRight: number = Math.min(this.lyrics.length - index, Math.ceil(this.nWordsToDisplay / 2));			
		const midpoint = Math.floor(this.nWordsToDisplay / 2)
		for (let i = 0; i < this.nWordsToDisplay; i++){
			let word = '';
			// on left side and in a populated position or on right side in a populated position
			if (i >= midpoint - nWordsOnLeft && 
					i < midpoint) {
				word = lyrics[index - midpoint + i];
			} else if (i <= Math.floor(this.nWordsToDisplay / 2) + nWordsOnRight &&
					i >= midpoint) {
				word = lyrics[index - midpoint + i];
			}
			let lyric = new PIXI.Text(word, {this.fontSize: this.fontSize, fill: color});
			lyric.y = this.height/2 - this.fontSize/2;			
			this.displayedLyrics.push(lyric);
			if (!this.lyricsAddedToStage) {
				this.pApp.stage.addChild(lyric);
			}
		}
		if (!this.lyricsAddedToStage) {
			this.lyricsAddedToStage = true;
		}

		
  	if (this.transcriptService.index - 1 >= 0) {
  		for (let i = this.displayedLyrics.length / 2 - 1; i >= 0; i--) {
  			this.displayedLyrics[i].text = this.transcriptService.getWordAt(this.transcriptService.index - (this.displayedLyrics.length / 2 - i));
  		}
  	}
  	if (this.transcriptService.index < this.displayedLyrics.length) {
  		for (let i = this.displayedLyrics.length / 2; i < this.displayedLyrics.length; i++){
  			this.displayedLyrics[i].text = this.transcriptService.getWordAt(this.transcriptService.index + (i - this.displayedLyrics.length / 2));
  		}
  	}
  	
  	this.positionLyrics(index ? index : 0);
  }
  */

  /*
  positionLyrics(index: number): void {
		// half of the words *could* be on the left side, if we have already progressed through 
		// those words. For such words we need to work backwards for positioning
		let curX: number;
		let nWordsOnLeft: number = Math.min(index, Math.floor(this.nWordsToDisplay / 2));
		let nWordsOnRight: number = Math.min(this.lyrics.length - index, Math.ceil(this.nWordsToDisplay / 2));			
		const midpoint = Math.floor(this.nWordsToDisplay / 2)
		// if (nWordsOnLeft > 0) {
			curX = this.width/2 - 20;
			for (let i = midpoint - 1; i >= 0; i--) {
  			curX -= this.displayedLyrics[i].width + this.wordSpacing;
				this.displayedLyrics[i].x = curX; 
				this.displayedLyrics[i].style.fill = 0x888888;
  		}
  	// }
		
		// everything at or after the index should be on the right side  	
		// if (nWordsOnRight > 0) {
			curX = this.width/2 + 20;
			for (let i = midpoint; i < this.nWordsToDisplay; i++){
  			this.displayedLyrics[i].x = curX; 
  			curX += this.displayedLyrics[i].width + this.wordSpacing;
  			if (i == this.displayedLyrics.length / 2){
          this.displayedLyrics[i].style.fill = 0xffffff;  
        } else {
          this.displayedLyrics[i].style.fill = 0xaaaaaa;
        }
			}
		// }

  }
  */

  
  

  
}
