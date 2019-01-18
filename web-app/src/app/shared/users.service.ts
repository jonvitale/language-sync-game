import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument, 
         AngularFirestoreCollection, Query, QueryFn,
         QueryDocumentSnapshot } from '@angular/fire/firestore';

import { TranscriptsService } from './transcripts.service';
import { Transcript } from './transcript.model';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

	private _currentUser: User;
	private _currentUserId: string;

	public get currentUser(): User {return this._currentUser}
	public get currentUserId(): string {return this._currentUserId}

  constructor(private afs: AngularFirestore, private transcriptService: TranscriptsService) { 
  }

  createNewUser(userName: string) : Promise<User|boolean> {
  	return new Promise((resolve, reject) => {
      let query: QueryFn = org => {
        let r: Query = org.where('userName', '==', userName);
        console.log(r);
        return r;
      };
      let ref = this.afs.collection('users', query);
      console.log(ref);
      ref.get().subscribe(
        (userSnapshot) => {
        	function uuidv4() {
					  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					    return v.toString(16);
					  });
					}

        	if (userSnapshot.docs.length == 0){
        		//let userId = uuidv4();
        		let doc = {
        			//'userId': userId,
        			'userName': userName,
        			'dateCreated': new Date()
        		};
        		this.afs.collection("users").add(doc)
        		.then(() => resolve(new User(doc)))
        		.catch(error => reject(error))
        	} else {
        		resolve(false);
        	}
        }
      );
    });
  }

  getExistingUser(userName: string): Promise<User|boolean> {
  	return new Promise((resolve, reject) => {
      let query: QueryFn = org => {
        let r: Query = org.where('userName', '==', userName);
        console.log(r);
        return r;
      };

      let ref = this.afs.collection('users', query);
      ref.get().subscribe(
        (userSnapshot) => {        	
        	if (userSnapshot.docs.length > 0){
        		this._currentUserId = userSnapshot.docs[0].id;
        		this._currentUser = new User(userSnapshot.docs[0].data(), this._currentUserId);
        		resolve(this.currentUser);
        	} else {
        		resolve(false);
        	}
        }
      );
    });
  }


  setUserTranscript(transcript: Transcript, transcriptId?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
    	let id: string;
    	if (transcriptId) {
    		id = transcriptId; 
    	} else if (this.transcriptService.currentTranscriptId){
        id = this.transcriptService.currentTranscriptId
      } else {
        reject("No available transcript id");
      }
      this.afs.collection("users")
      .doc(this._currentUserId)
      .collection("transcripts")
      .doc(id)
      .set(transcript.json, {merge: true})
      .then(() => resolve(true))
      .catch(error => reject(error));
    })
  }
}
