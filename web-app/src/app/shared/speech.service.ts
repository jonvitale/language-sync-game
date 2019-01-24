import { Injectable } from '@angular/core';

import annyang from 'annyang';

// declare var annyang: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

	private _words: string[];
	private _index: number;
	private _curCommand: {};

  constructor() { 
  	console.log("annyang1", annyang);
  	annyang.debug(true);
  	annyang.setLanguage('it-IT');
  	// annyang.addCallback('start', () => console.log("annyang started"));
  	// annyang.addCallback('soundstart', () => console.log("annyang sound started"));
  	// annyang.addCallback('error', (error) => console.log("annyang error", error));
  	// annyang.addCallback('resultMatch', (phrase, command, alternatives) => console.log("annyang result", phrase, command, alternatives));
  	// annyang.addCommands({'minimo': () => console.log("minimo detected")});
  	// annyang.start();
  	// annyang.start({ autoRestart: false, continuous: true, paused: false });

  }

  startWords(words: string[]) {
  	console.log("annyang2", annyang);
  	this._words = words;
  	this._index = 0;
  	let word = this._words[this._index]; 
  	let command = {};
  	command[word] = this.detectNextWord.bind(this);
  	// annyang.init({'minimo': () => console.log("minimo detected")}, true);
  	// annyang.start({ autoRestart: false, continuous: true, paused: false });
  	// annyang.addCommands(command);
  	// annyang.addCommands({word: () => console.log(word, "detected")});
  	
  	let recognition = annyang.getSpeechRecognizer();
  	// recognition.interimResults = true;
  	recognition.onresult = (event) => {
  		console.log("onresult event", event)
  	}
  	annyang.start();
  	// this.detectNextWord();
  }

  detectNextWord() {
  	console.log("annyang3", annyang, this);
  	if (this._index > 0){
  		annyang.removeCommmands(this._words[this._index - 1]);
  	}
  	
  	// let word = this._words[this._index]; 
  	let word = 'minimo';
  	let command = {};
  	command[word] = this.detectNextWord.bind(this);
  	console.log("detect word: ", word, command);
  	this._curCommand = command;
  	this._index++;
  	annyang.addCommands(command);
  }
}
