import { Component, OnInit, EventEmitter, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { CreateSyncGameDisplayComponent } from './create-sync-game-display/create-sync-game-display.component';
import { TranscriptsService } from '../../shared/transcripts.service';
import { UsersService } from '../../shared/users.service';
import { AudioService } from '../../shared/audio.service';
import { Transcript } from '../../shared/transcript.model';

@Component({
  selector: 'app-create-sync-game',
  templateUrl: './create-sync-game.component.html',
  styleUrls: ['./create-sync-game.component.css']
})
export class CreateSyncGameComponent implements OnInit {

	@ViewChild(CreateSyncGameDisplayComponent) private displayComponent: CreateSyncGameDisplayComponent;
	private isPlaying: boolean = false;
  private isPaused: boolean = false;
  
  constructor(private transcriptService: TranscriptsService, 
              private usersService: UsersService,
              private audioService: AudioService,
              private router: Router) { }

  ngOnInit() {
  	let currentTranscript = this.transcriptService.currentTranscript;
    if (currentTranscript == null){
      this.router.navigate([''])
    } else {
      this.audioService.loadAudio(currentTranscript.title + '.mp3', this.onStop.bind(this));
    }
  }

  onPlay(event?: Event) {
  	console.log("play event", event);
  	const filename = this.transcriptService.currentTranscript.title;
    if (this.isPlaying) {
      if (this.isPaused){
        this.audioService.unpauseAudio();
      } else {
        this.audioService.pauseAudio();
      }
      this.isPaused = !this.isPaused; 
    } else {
      this.isPlaying = true;
      this.audioService.playAudio(filename + '.mp3');
      this.displayComponent.createNewSync();  
    }
	  
  }

  onStop(event?: Event) {
    this.isPaused = false;
    this.isPlaying = false;
    this.audioService.stopAudio();
  	this.displayComponent.onStop();
    // push transcript to database
    this.usersService.setUserTranscript(this.transcriptService.currentTranscript, this.transcriptService.currentTranscriptId);
  }

  onPlayTiming() {
  	const filename = this.transcriptService.currentTranscript.title;
	  this.audioService.playAudio(filename + '.mp3');
	  this.displayComponent.playCurrentSync();
  }

  onKeyPress(event: KeyboardEvent) {
  	if (event.key == 'ArrowRight'){
  		this.displayComponent.advanceSync();
  	}  	
  }

}
