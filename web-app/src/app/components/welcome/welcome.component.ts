import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from '../../shared/users.service';
import { TranscriptsService } from '../../shared/transcripts.service';
import { User } from '../../shared/user.model';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(private usersService: UsersService, 
  						private router: Router) { }

  ngOnInit() {
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
  			this.router.navigate(['/home'])
  		} else {
  			console.log("user does not exist");
  		}  		
  	})
  	.catch(error => console.log("error", error));
  }

}
