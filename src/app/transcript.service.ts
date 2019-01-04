import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

import { Transcript } from './shared/Transcript';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {

  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

  getTranscriptText(filename): Promise<string> {
  	return new Promise((resolve, reject) => {
  		let storageRef = this.storage.ref('transcripts/'+filename);
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

  getTranscript(filename): Promise<Transcript> {
  	return new Promise((resolve, reject) => {
  		this.getTranscriptText(filename).then( (txt: string) => {
  			resolve(new Transcript(txt));
  		}, error => {
  			reject(error);
  		});
  	});
  }
}
