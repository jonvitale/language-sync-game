import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../../shared/user.service';
import { TranscriptService } from '../../shared/transcript.service';
import { User } from '../../shared/user.model';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private userService: UserService, 
  						private router: Router) { }

  ngOnInit() {
  }

  onSubmitNewUser(form: NgForm) {
  	let userName = form.value.userName;
  	this.userService.createNewUser(userName)
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
  	this.userService.getExistingUser(userName)
  	.then((user: User|boolean) => {
  		if (user instanceof User){
  			this.router.navigate(['/home'])
  		} else {
  			console.log("user does not exist");
  		}  		
  	})
  	.catch(error => console.log("error", error));
  }

}
