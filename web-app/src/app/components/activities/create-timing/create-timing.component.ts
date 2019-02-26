import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { GameDisplayComponent } from '../game-display/game-display.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';
import { TranscriptService } from '../../../shared/transcript.service';
import { UserService } from '../../../shared/user.service';
import { AudioService } from '../../../shared/audio.service';
import { SpeechService } from '../../../shared/speech.service';
import { Transcript } from '../../../shared/transcript.model';

@Component({
  selector: 'app-create-timing',
  templateUrl: './create-timing.component.html',
  styleUrls: ['./create-timing.component.css']
})
export class CreateTimingComponent implements OnInit, OnDestroy {

	@ViewChild(GameDisplayComponent) private displayComponent: GameDisplayComponent;
	@ViewChild(GameControlsComponent) private controlsComponent: GameControlsComponent;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private audioSubscription;
  
  constructor(private transcriptService: TranscriptService, 
              private userService: UserService,
              private audioService: AudioService,
              private router: Router) { }

  ngOnInit() { 
    this.audioSubscription = this.audioService.playStatus.subscribe((status: string) => {
      if (status == 'playing') {
        this.controlsComponent.playText = 'pause';        
        this.transcriptService.initialize();
        this.displayComponent.initialize(this.transcriptService.words);  
      } else if (status === 'completed') {
        this.controlsComponent.playText = 'play';
        this.displayComponent.stop();        
        this.onCompleted();
      } else if (status === 'stopped') {
        this.controlsComponent.playText = 'play';
        this.displayComponent.stop(); 
      } else if (status === 'paused') {
        this.controlsComponent.playText = 'resume';
        this.displayComponent.pause();
      } else if (status === 'resumed') {
        this.controlsComponent.playText = 'pause';
        this.displayComponent.resume();
      }
    });
  }

  ngOnDestroy() {
    this.audioSubscription.unsubscribe();
  }

  onControlsEvent(event: {type: string, text: string}) {
    if (event.type === 'play') {
      if (event.text == 'play'){
        this.audioService.playAudio();
      } else if (event.text == 'pause') {
        this.audioService.pauseAudio();
      } else if (event.text == 'resume') {
        this.audioService.resumeAudio();
      }
    } else if (event.type === 'stop') {
      this.audioService.stopAudio();
    }
  }

  onKeyPress(event: KeyboardEvent) {
  	if (event.key == 'ArrowRight'){
  		this.transcriptService.setTime(-100);
      this.displayComponent.shiftLyrics();
  	}  	
  }

  onCompleted() {
    this.userService.uploadUserTranscript();
  }

}
