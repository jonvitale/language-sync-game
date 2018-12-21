import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	private filename: string = '';
	private sound: Howl;

  constructor(private http: HttpClient) { }

  loadAudio(filename): Promise<boolean> {
  	return new Promise((resolve, reject) => {
  		if (filename !== this.filename){  		
  			try {
					this.sound = new Howl({
						src: ['../../assets/audio/' + filename],
						preload: true,
						onload: () => resolve(true)
					});
				} catch (e) {
					reject(e)
				}			
			} else {
				resolve(true);
			}
		});
  }

	playAudio(filename): void {
		if (filename !== this.filename){
			this.sound = new Howl({
				src: ['../../assets/audio/' + filename],
				preload: true
			});
		}
		
		this.sound.play();
	}



	getTranscriptText(filename): Promise<string> {
  	return new Promise((resolve, reject) => {
  		this.http.get("assets/transcripts/" + filename, {responseType: 'text'})
  		.subscribe((txt: string) => {
  			resolve(txt);
  		});
  	});
  }  
}
