import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	private filename: string = '';
	private http: HttpClient;
	private sound: Howl;
	private isPlaying: boolean = false;
	private endCallback: (...args: any[]) => void;

  loadAudio(filename: string, endCallback: (...args: any[]) => void): Promise<boolean> {
  	return new Promise((resolve, reject) => {
  		if (filename !== this.filename){  		
  			try {
  				this.filename = filename;
  				this.endCallback = endCallback;
					this.sound = new Howl({
						src: ['../../assets/audio/' + filename],
						autoplay: false,
						preload: true,
						onload: () => resolve(this.sound),
						onend: () => {
							this.isPlaying = false;
							this.endCallback();
						}
					});
				} catch (e) {
					reject(e)
				}			
			} else {
				resolve(true);
			}
		});
  }

	playAudio(filename: string, endCallback?: (...args: any[]) => void): void {
		if (filename !== this.filename){
			try {
				this.loadAudio(filename, endCallback).then((sound: Howl) => {
					this.isPlaying = true;
					this.sound.play();
				});
			} catch (e) {
				console.log(e);
			}
		} else {
			this.isPlaying = true;
			this.sound.play();
		}	
		
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
