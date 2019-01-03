import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';

import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	private filename: string = '';
	private sound: Howl;
	private isPlaying: boolean = false;
	private isPaused: boolean = false;
	private playRef: number;
	private pauseRef: number;
	private endCallback: (...args: any[]) => void;

	constructor (private http: HttpClient, private storage: AngularFireStorage) { }

  loadAudio(filename: string, endCallback: (...args: any[]) => void): Promise<boolean> {
  	return new Promise((resolve, reject) => {
  		if (filename !== this.filename){  		
  			try {
  				let storageRef = this.storage.ref('audio/'+filename);
			  	storageRef.getDownloadURL().subscribe(url => {
						this.filename = filename;
	  				this.endCallback = endCallback;
						this.sound = new Howl({
							src: [url],
							autoplay: false,
							preload: true,
							onload: () => resolve(this.sound),
							onend: () => {
								this.isPlaying = false;
								this.endCallback();
							}
						});
					});
  				
				} catch (e) {
					reject(e)
				}			
			} else {
				resolve(true);
			}
		});
  }

	playAudio(filename: string, endCallback?: (...args: any[]) => void): boolean {
		if (filename != this.filename){
			try {
				this.loadAudio(filename, endCallback).then((sound: Howl) => {
					this.sound = sound;
					this.isPlaying = true;
					this.playRef = this.sound.play();
					return true;
				});
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			console.log("hi");
			this.isPlaying = true;
			this.playRef = this.sound.play();
			return true;
		}	
		
	}

	stopAudio(): boolean {
		if (this.isPlaying){
			try {
				this.sound.stop();
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			return false;
		}
	}

	pauseAudio(): boolean {
		if (this.isPlaying){
			try {
				this.isPaused = true;
				this.pauseRef = this.sound.pause(this.playRef);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			return false;
		}
	}

	unpauseAudio(): boolean {
		if (this.isPlaying){
			try {
				//this.playRef = 
				this.sound.play(this.playRef);
				this.sound.seek(this.pauseRef, this.playRef);
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			return false;
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
