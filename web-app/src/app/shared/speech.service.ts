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

  detectWord(word: string, callback: () => any) {
    // let command= {'Cibo': (word) => console.log("detected", word)};
    // annyang.addCallback('resultMatch', (phrase, command, alternatives) => console.log("annyang result", phrase, command, alternatives));
    annyang.addCallback('result', (alternatives: string[]) => {
      // function unicodeToChar(text) {
      //   return text.replace(/\\u[\dA-F]{4}/gi, 
      //     function (match) {
      //        return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
      //     });
      // }
      for (let i = 0; i < alternatives.length; i++){
        console.log('alternative', alternatives[i], 'word', word);//, 
          // 'alternative-u', unicodeToChar(alternatives[i].trim().toLowerCase()), 'word-u',unicodeToChar(word.trim().toLowerCase()), 
          // alternatives[i].trim().toLowerCase() === word.trim().toLowerCase(), alternatives[i] === word);
        if (alternatives[i].trim().toLowerCase() === word.trim().toLowerCase()) {
          callback();
          return;
        }
      }
    });
    // command[word] = callback;
    // command['Cibo'] = () => console.log("detected Cibo"); 
    // annyang.init(command);
    // annyang.init();
    annyang.start();
  }

  stop() {
    if (annyang.isListening()) annyang.abort();
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
