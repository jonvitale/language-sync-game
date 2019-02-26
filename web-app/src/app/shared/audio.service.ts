import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

	private filename: string = '';
	private sound: Howl;
	private playRef: number;
	private pauseRef: number;
	private playStatusSubject: BehaviorSubject<string>;
	private playStatusObservable: Observable<string>;
	
	public get isPlaying(): boolean { return this.playStatusSubject.value === 'playing' ||
																					 this.playStatusSubject.value === 'resumed' };
	public get isStopped(): boolean { return this.playStatusSubject.value === 'stopped' || 
																					 this.playStatusSubject.value === 'completed' };
	public get isPaused(): boolean { return this.playStatusSubject.value === 'paused' };
	public get playStatus(): Observable<string> { return this.playStatusObservable }

	constructor (private http: HttpClient, private storage: AngularFireStorage) { 
		this.playStatusSubject = new BehaviorSubject('stopped');
		this.playStatusObservable = this.playStatusSubject.asObservable();
	}

  loadAudio(filename: string): Promise<boolean> {
  	return new Promise((resolve, reject) => {
  		if (filename !== this.filename){  		
  			try {
  				let storageRef = this.storage.ref('audio/'+filename);
			  	storageRef.getDownloadURL().subscribe(url => {
						this.filename = filename;
	  				this.sound = new Howl({
							src: [url],
							autoplay: false,
							preload: true,
							onload: () => resolve(this.sound),
							onend: () => this.playStatusSubject.next('completed'),
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

	playAudio(filename?: string): boolean {
		if (this.isStopped) {
			if (filename && filename != this.filename){
				try {
					this.loadAudio(filename).then((sound: Howl) => {
						this.sound = sound;
						this.playStatusSubject.next('playing');
						this.playRef = this.sound.play();
						return true;
					});
				} catch (e) {
					console.log(e);
					return false;
				}
			} else {
				this.playRef = this.sound.play();
				this.playStatusSubject.next('playing');
				return true;
			}	
		}
	}

	stopAudio(): boolean {
		if (this.isPlaying || this.isPaused){
			try {
				this.sound.stop();
				this.playStatusSubject.next('stopped');
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
				this.pauseRef = this.sound.pause(this.playRef);
				this.playStatusSubject.next('paused');
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			return false;
		}
	}

	resumeAudio(): boolean {
		if (this.isPaused){
			try {
				this.sound.play(this.playRef);
				this.sound.seek(this.pauseRef, this.playRef);
				this.playStatusSubject.next('resumed');
				return true;
			} catch (e) {
				console.log(e);
				return false;
			}
		} else {
			return false;
		}
	}

}
