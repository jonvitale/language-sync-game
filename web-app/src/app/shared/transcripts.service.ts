import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument, 
         AngularFirestoreCollection, Query, QueryFn,
         QueryDocumentSnapshot } from '@angular/fire/firestore';

import { UsersService } from './users.service';

import { Transcript } from './transcript.model';

@Injectable({
  providedIn: 'root'
})
export class TranscriptsService {
  private _currentTranscript: Transcript;
  private _currentTranscriptId: string;

  public get currentTranscriptId(): string { return this._currentTranscriptId }
  public get currentTranscript(): Transcript { return this._currentTranscript }

  constructor(private http: HttpClient, 
              private storage: AngularFireStorage,
              private afs: AngularFirestore) { }

  //// Storage-based

  
  getTranscriptTextFromStorage(filename: string): Promise<string> {
  	return new Promise((resolve, reject) => {
  		let storageRef = this.storage.ref('transcripts/'+filename+".txt");
	  	storageRef.getDownloadURL().subscribe(
	  		(url: string) => {
          this.http.get(url, {responseType: 'text'}).subscribe(
		  			(txt: string) => {
              txt = txt.replace(/\s+/g, ' ');
              resolve(txt);
		  			}, error => reject(error)
		  		);
				}, error => reject(error)
			);	  		
  	});
  }

  //// Cloud-Firestore based

  getTranscriptTitles(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let ref = this.afs.collection('transcripts');
      ref.get().subscribe(
        (transcriptSnapshot) => {
          let titles: string[] = [];
          for (let i = 0; i < transcriptSnapshot.docs.length; i++){
            if (transcriptSnapshot.docs[i].data()['title']){
              titles.push(transcriptSnapshot.docs[i].data()['title']);
            }
          }
          resolve(titles);
        }
      );
    });
  }

  getTranscript(title: string): Promise<Transcript> {
  	return new Promise((resolve, reject) => {
      // first we check if the user has a transcript
      let query: QueryFn = org => {
        let r: Query = org.where('title', '==', title);
        console.log(r);
        return r;
      };
      let ref = this.afs.collection('transcripts', query);
      ref.get().subscribe(
        (transcriptSnapshot) => {
          console.log(transcriptSnapshot);
          this._currentTranscriptId = transcriptSnapshot.docs[0].id;
          this._currentTranscript = new Transcript(transcriptSnapshot.docs[0].data(), transcriptSnapshot.docs[0].id);
          resolve(this.currentTranscript);
        }
      );
  	});
  }

  getTranscriptText(title: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getTranscript(title)
      .then((transcript: Transcript) => resolve(transcript.fullText))
      .catch(error => resolve(error));
    });
  }

  getUserTranscript(title: string, userId: string): Promise<Transcript> {
    return new Promise((resolve, reject) => {
      // first we check if the user has a transcript
      let query: QueryFn = org => {
        let r: Query = org.where('title', '==', title);
        console.log(r);
        return r;
      };
      let ref = this.afs.collection("users").doc(userId)
      .collection("transcripts", query);
      ref.get().subscribe(
        (transcriptSnapshot) => {
          console.log(transcriptSnapshot.docs[0].data());
          this._currentTranscriptId = transcriptSnapshot.docs[0].id;
          this._currentTranscript = new Transcript(transcriptSnapshot.docs[0].data(), transcriptSnapshot.docs[0].id);
          console.log(this._currentTranscript);
          resolve(this._currentTranscript);
        }, error => reject(error)
      );
    });
  }

}
