import { Component, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';

import { CreateSyncGameDisplayComponent } from './create-sync-game-display/create-sync-game-display.component';
import { TranscriptService } from '../../transcript.service';
import { AudioService } from '../../audio.service';
import { Transcript } from '../../shared/Transcript';

@Component({
  selector: 'app-create-sync-game',
  templateUrl: './create-sync-game.component.html',
  styleUrls: ['./create-sync-game.component.css']
})
export class CreateSyncGameComponent implements OnInit {

	@ViewChild(CreateSyncGameDisplayComponent) private displayComponent: CreateSyncGameDisplayComponent;
	private currentSyncFilename: string = 'pronunciation_mese_d_affitto';
	private currentTranscript: Transcript;

  constructor(private transcriptService: TranscriptService, private audioService: AudioService) { }

  ngOnInit() {
  	let filename = this.currentSyncFilename;
  	this.transcriptService.getTranscript(filename + '.txt')
  	.then((transcript: Transcript) => {
  		this.currentTranscript = transcript;
  		this.audioService.loadAudio(filename + '.mp3');
  	});
  }

  onPlay(event: Event) {
  	console.log("play event", event);
  	// take off focus on this element because it will capture keyboard presses
  	//event.srcElement.blur();
  	if (event instanceof MouseEvent) {
	  	let filename = this.currentSyncFilename;
	  	this.audioService.playAudio(filename + '.mp3');
	  	this.displayComponent.onPressedPlay(true);
	  }
  }

  onStop() {

  }

  onPlayTiming() {
  	let filename = this.currentSyncFilename;
	  this.audioService.playAudio(filename + '.mp3');
	  this.displayComponent.onPressedPlay(false);
  }

  onKeyPress(event: KeyboardEvent) {
  	if (event.key == 'ArrowRight'){
  		this.displayComponent.onSyncAction();
  	}
  	
  }

}
