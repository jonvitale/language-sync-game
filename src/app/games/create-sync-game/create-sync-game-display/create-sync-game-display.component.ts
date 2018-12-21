declare var PIXI: any; // instead of importing pixi like some tutorials say to do use declare

import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';

import { Transcript } from '../../../shared/Transcript';

@Component({
  selector: 'app-create-sync-game-display',
  templateUrl: './create-sync-game-display.component.html',
  styleUrls: ['./create-sync-game-display.component.css']
})
export class CreateSyncGameDisplayComponent implements OnInit {

	@Input() transcript: Transcript;
	@ViewChild('pixiContainer') pixiContainer; // this allows us to reference and load stuff into the div container
	private pApp: PIXI.Application;
	private index: number = 0;
	private pText: PIXI.Text;
	private isPlaying: boolean = false;
	private startTime: number;

  constructor() { }

  ngOnInit() {
  	this.pApp = new PIXI.Application({ width: 800, height: 200, backgroundColor: 0xbafff7 }); // this creates our pixi application

		this.pixiContainer.nativeElement.appendChild(this.pApp.view); // this places our pixi application onto the viewable document
  }

  ngOnChanges() {  	
  }

  onPressedPlay(setTiming: boolean) {
  	if (this.pApp != null && this.transcript.length > 0){
  		console.log(this.transcript);
  		this.startTime =	(new Date()).getTime();
  		this.isPlaying = true;
  		if (setTiming){
	  		this.pText = new PIXI.Text(this.transcript.getWordAt(this.index));
		  	this.pApp.stage.addChild(this.pText);
		  } else {
		  	let time = this.transcript.getTimeAt(0);
		  	console.log("time", time);
		  	setTimeout(() => {
		  		this.pText.text = this.transcript.getWordAt(0);
		  	}, time);
		  }
		}
  }

  onSyncAction() {
  	if (this.isPlaying && this.index < (this.transcript.length-1)){
  		this.transcript.setTimeAt(this.index, (new Date()).getTime() - this.startTime);
  		++this.index;
	  	this.pText.text = this.transcript.getWordAt(this.index);
	  }
  }

}
