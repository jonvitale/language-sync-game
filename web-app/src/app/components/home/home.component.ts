import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AudioService } from '../../shared/audio.service';
import { UserService } from '../../shared/user.service';
import { TranscriptService } from '../../shared/transcript.service';
import { User } from '../../shared/user.model';
import { Transcript } from '../../shared/transcript.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	private transcriptTitles: string[];
	private currentUser: User;
  private options2 = [{id: 1, name: 'hi'}, {id: 2, name: 'bye'}];

  constructor(private userService: UserService, 
              private audioService: AudioService, 
  						private transcriptService: TranscriptService,
  						private router: Router) { }


  ngOnInit() {
  	this.transcriptService.fetchTranscriptTitles()
  	.then((titles: string[]) => {
  		console.log(titles);
  		this.transcriptTitles = titles;
  	})
  	.catch(error => console.log("error", error));
  }

  
  onCreateTiming(title: string) {
  	if (this.userService.currentUser != null){
      // first check to see if the user has a version of this transcript
      this.transcriptService.fetchUserOrGeneralTranscript(title, this.userService.currentUserId)
      .then((transcript: Transcript) => {
        if (transcript instanceof Transcript) {
          this.loadAudioThenRoute(title, '/create-timing');
        } else {
          // if not, get it from the main store
          this.transcriptService.fetchTranscript(title)
          .then(() => this.loadAudioThenRoute(title, '/create-timing'))
        }
      })
      .catch(error => console.log("error", error));  		
  	}
  }

  onPlayTiming(title: string) {
    if (this.userService.currentUser != null){
      // first check to see if the user has a version of this transcript
      this.transcriptService.fetchUserOrGeneralTranscript(title, this.userService.currentUserId)
      .then((transcript: Transcript) => {
        if (transcript instanceof Transcript) {
          this.loadAudioThenRoute(title, '/play-timing');
        } else {
          // if not, get it from the main store
          this.transcriptService.fetchTranscript(title)
          .then(() => this.loadAudioThenRoute(title, '/play-timing'))
        }
      })
      .catch(error => console.log("error", error));      
    }
  }

  loadAudioThenRoute(title, path){
    this.audioService.loadAudio(title + '.mp3')
    .then(() => this.router.navigate([path]))
    .catch(() => console.log(title, "has no such audio"))
  }

}
