import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument, 
         AngularFirestoreCollection, Query, QueryFn,
         QuerySnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Subject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AudioService } from './audio.service';
import { Transcript } from './transcript.model';

export interface WordDetails {
  index: number,
  word: string,
  time: number
}

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  public index: number = 0;
  public transcriptId: string;
  
  private transcript: Transcript;
  private startTime: number;
  private observables$: Observable<QuerySnapshot<any>>[];
  private wordStreamSubject: Subject<WordDetails>;
  private wordStreamObservable: Observable<WordDetails>;
  private isPlaying: boolean = false;

  public get id(): string { return this.transcriptId }
  public get title(): string { return this.transcript.title }
  public get json(): {} { return this.transcript.json }
  public get length(): number {
    if (this.transcript) {
      return this.transcript.length;
    } else {
      return null;
    }
  }
  public get words(): string[] {
    if(this.transcript){
      return this.transcript.words;
    } else {
      return null;
    }
  }
  public get wordStream(): Observable<WordDetails> { return this.wordStreamObservable }

  constructor(private http: HttpClient, 
              private storage: AngularFireStorage,
              private afs: AngularFirestore) { 
    this.wordStreamSubject = new Subject();
    this.wordStreamObservable = this.wordStreamSubject.asObservable();
  }

  //// Interact with current transcript
  getWordAt(index: number): string {
    if (this.transcript) {
      return this.transcript.getWordAt(index);
    } else {
      return null;
    }  
  }

  getTimeAt(index: number): number {
    if (this.transcript) {
      return this.transcript.getTimeAt(index);
    } else {
      return null;
    }  
  }

  setTime(offset): boolean {
    if (this.transcript) {
      let time = (new Date()).getTime() - this.startTime + offset;
      console.log("time", time);
      if (this.transcript.setTimeAt(this.index, time)) {
        this.wordStreamSubject.next({
          'index': this.index, 
          'word': this.getWordAt(this.index),
          'time': this.getTimeAt(this.index),
        });
        this.index++;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }    
  }

  /// playback stream
  initialize() {
    this.index = 0;
    this.startTime = (new Date()).getTime();
    this.isPlaying = true;
  }

  play() {
    if (this.index < this.length) {
      let duration = this.getTimeAt(this.index) - 
                    (this.index > 0 ? this.getTimeAt(this.index-1) : 0);

      setTimeout(() => {
        if (this.isPlaying){
          this.wordStreamSubject.next({
            'index': this.index, 
            'word': this.getWordAt(this.index),
            'time': this.getTimeAt(this.index),
          });
          this.index++;
          this.play();
        }
      }, duration);      
    } else {
      this.stop();
    }
  }

  pause() {
    this.isPlaying = false;
  }

  resume() {
    this.isPlaying = true;
    this.play();
  }

  stop() {
    this.isPlaying = false;
    this.index = 0;
  }

  //// Storage-based

  
  fetchTranscriptTextFromStorage(filename: string): Promise<string> {
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

  fetchTranscriptTitles(): Promise<string[]> {
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

  fetchUserTranscript(title: string, userId: string): Promise<Transcript> {
    return new Promise((resolve, reject) => {
      // first we check if the user has a transcript
      let query: QueryFn = org => {
        return org.where('title', '==', title);
      };
      this.afs.collection("users").doc(userId).collection("transcripts", query)
      .get()
      .pipe(
        take(1)
      )
      .subscribe(
        transcriptSnapshot => {
          if (transcriptSnapshot.docs.length > 0) {
            this.transcriptId = transcriptSnapshot.docs[0].id;
            this.transcript = new Transcript(transcriptSnapshot.docs[0].data(), transcriptSnapshot.docs[0].id);
            console.log('user transcript', this.transcript);
            resolve(this.transcript);
          } else {
            reject("no transcript found");
          }
          
        }, error => reject(error)
      );
    });
  }

  fetchTranscript(title: string): Promise<Transcript> {
  	return new Promise((resolve, reject) => {
      // first we check if the user has a transcript
      let query: QueryFn = org => {
        return org.where('title', '==', title);
      };
      let ref = this.afs.collection('transcripts', query)
      .get()
      .pipe(
        take(1)
      )
      .subscribe(
        transcriptSnapshot => {
          this.transcriptId = transcriptSnapshot.docs[0].id;
          this.transcript = new Transcript(transcriptSnapshot.docs[0].data(), transcriptSnapshot.docs[0].id);
          console.log('general transcript', transcriptSnapshot);
          resolve(this.transcript);
        }, error => reject(error)        
      );
  	});
  }

  fetchUserOrGeneralTranscript(title: string, userId?: string): Promise<Transcript> {
    return new Promise((resolve, reject) => {
      if (userId) {
        this.fetchUserTranscript(title, userId)
        .then((transcript: Transcript) => resolve(transcript))
        .catch(error => {
          this.fetchTranscript(title)
          .then((transcript: Transcript) => resolve(transcript))
          .catch(error => reject(error))
        });
      } else {
        this.fetchTranscript(title)
        .then((transcript: Transcript) => resolve(transcript))
        .catch(error => reject(error))
      }
    })
  } 

}
