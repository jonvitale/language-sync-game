import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { AudioService } from '../../../shared/audio.service';

@Component({
  selector: 'app-game-controls',
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.css']
})
export class GameControlsComponent implements OnInit, OnDestroy {

	@Output() controlsEvent = new EventEmitter<{type: string, text: string}>();
	public playText: string = "play";
	public stopText: string = "stop";
	private waiting: boolean = false;
	private audioSubscription;

  constructor(private audioService: AudioService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onPlay() {
  	this.controlsEvent.emit({type: 'play', text: this.playText});
  }

  onStop() {
  	this.controlsEvent.emit({type: 'stop', text: this.stopText});
  }

  wait() {
  	this.waiting = true;
  }

  endWaiting() {
  	this.waiting = false;
  }
}
