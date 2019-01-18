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

  onSubmitNewUser(form: NgForm) {
  	let userName = form.value.userName;
  	this.usersService.createNewUser(userName)
  	.then((user: User|boolean) => {
  		if (user instanceof User){
  			console.log("welcome new user", user);
  		} else {
  			console.log("user already exists");
  		}
  	})
  	.catch(error => console.log("error", error));
  }

  onSubmitLogin(form: NgForm) {
  	let userName = form.value.userName;
  	this.usersService.getExistingUser(userName)
  	.then((user: User|boolean) => {
  		if (user instanceof User){
  			this.currentUser = user;
  			console.log("welcome", user);
  		} else {
  			console.log("user does not exist");
  		}  		
  	})
  	.catch(error => console.log("error", error));
  }

  onSelectTitle(title: string) {
  	if (this.usersService.currentUser != null){
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
