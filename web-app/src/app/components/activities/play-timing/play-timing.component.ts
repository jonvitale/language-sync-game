import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { GameDisplayComponent } from '../game-display/game-display.component';
import { GameControlsComponent } from '../game-controls/game-controls.component';
import { TranscriptService, WordDetails } from '../../../shared/transcript.service';
import { UserService } from '../../../shared/user.service';
import { AudioService } from '../../../shared/audio.service';
import { SpeechService } from '../../../shared/speech.service';
import { Transcript } from '../../../shared/transcript.model';

@Component({
  selector: 'app-play-timing',
  templateUrl: './play-timing.component.html',
  styleUrls: ['./play-timing.component.css']
})
export class PlayTimingComponent implements OnInit, OnDestroy {

  @ViewChild(GameDisplayComponent) private displayComponent: GameDisplayComponent;
	@ViewChild(GameControlsComponent) private controlsComponent: GameControlsComponent;
  private audioSubscription;
  private transcriptSubscription;
  private waitAtIndex: number;
  private _time;
  
  constructor(private transcriptService: TranscriptService, 
              private userService: UserService,
              private audioService: AudioService,
              private speechService: SpeechService,
              private router: Router) { }

  ngOnInit() { 
    this.audioSubscription = this.audioService.playStatus.subscribe(
      (status: string) => {
        if (status == 'playing') {
          this.controlsComponent.playText = 'pause';
          this.transcriptService.initialize();
          this.transcriptService.play();
          this.displayComponent.initialize(this.transcriptService.words);  
        } else if (status === 'stopped' || status === 'completed') {
          this.controlsComponent.playText = 'play';
          this.transcriptService.stop();
          this.displayComponent.stop(); 
          this.speechService.stop();
        } else if (status === 'paused') {
          this.controlsComponent.playText = 'resume';
          this.transcriptService.pause();
          this.displayComponent.pause();
        } else if (status === 'resumed') {
          this.controlsComponent.playText = 'pause';
          this.transcriptService.resume();
          this.displayComponent.resume();
        }
      }
    );

    
    this.transcriptSubscription = this.transcriptService.wordStream.subscribe(
      (wordDetails: WordDetails) => {
        // console.log('wordDetails', wordDetails);
        if (wordDetails.index === this.waitAtIndex) {
          this.controlsComponent.wait();
          this.audioService.pauseAudio();
          this.speechService.detectWord(this.transcriptService.words[wordDetails.index] + ' ' + this.transcriptService.words[wordDetails.index+1], this.onDetectedWord.bind(this));
        } else {
          this.displayComponent.shiftLyrics();          
        }
      }
    );

  }

  

  onControlsEvent(event: {type: string, text: string}) {
    if (event.type === 'play') {
      if (event.text == 'play'){
        // this.waitAtIndex = 0;
        this.waitAtIndex = Math.floor(Math.random() * (this.transcriptService.length-1));
        // this.displayComponent.initialize(this.transcriptService.words);  
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

  onDetectedWord() {
    this.speechService.stop();
    this.controlsComponent.endWaiting();
    this.audioService.resumeAudio();
  }

  ngOnDestroy() {
    this.audioSubscription.unsubscribe();
    this.transcriptSubscription.unsubscribe();
  }
}
