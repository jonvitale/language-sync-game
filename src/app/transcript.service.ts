import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

import { Transcript } from './shared/Transcript';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {

  constructor(private http: HttpClient, private storage: AngularFireStorage) { }

  getTranscriptText(filename): Promise<any> {
  	return new Promise((resolve, reject) => {
  		try {
				let storageRef = this.storage.ref('transcripts/'+filename);
		  	storageRef.getDownloadURL().subscribe(
		  		(url: string) => {
			  		console.log(url);
			  		this.http.get(url, {responseType: 'text'}).subscribe(
			  			(txt) => {
			  			console.log(txt);
			  			resolve(txt);
			  			}, error => console.log(error)
			  		);
					}, error => console.log(error)
				);
				
			} catch (e) {
				reject(e)
			}			  		
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
