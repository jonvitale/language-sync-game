import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UsersService } from '../../shared/users.service';
import { TranscriptsService } from '../../shared/transcripts.service';
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

  constructor(private usersService: UsersService, 
  						private transcriptsService: TranscriptsService,
  						private router: Router) { }


  ngOnInit() {
  	this.transcriptsService.getTranscriptTitles()
  	.then((titles: string[]) => {
  		console.log(titles);
  		this.transcriptTitles = titles;
  	})
  	.catch(error => console.log("error", error));
  }

  
  onSelectTitle(title: string) {
  	if (this.usersService.currentUser != null){
      console.log("selected title", title);
      // first check to see if the user has a version of this transcript
      this.transcriptsService.getUserTranscript(title, this.usersService.currentUserId)
      .then((transcript: Transcript) => {
        if (transcript instanceof Transcript) {
          this.router.navigate(['/create-sync']);
        } else {
          // if not, get it from the main store
          this.transcriptsService.getTranscript(title)
          .then(() => this.router.navigate(['/create-sync']))
        }
      })
      .catch(error => console.log("error", error));  		
  	}
  }
}
