import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Transcript } from './shared/Transcript';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {

  constructor(private http: HttpClient) { }

  getTranscriptText(filename): Promise<string> {
  	return new Promise((resolve, reject) => {
  		this.http.get("assets/transcripts/" + filename, {responseType: 'text'})
  		.subscribe((txt: string) => {
  			resolve(txt);
  		});
  	});
  }

  getTranscript(filename): Promise<Transcript> {
  	return new Promise((resolve, reject) => {
  		this.http.get("assets/transcripts/" + filename, {responseType: 'text'})
  		.subscribe((txt: string) => {
  			resolve(new Transcript(txt));
  		});
  	});
  }
}
