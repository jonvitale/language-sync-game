export class Transcript {
	private _transcriptId: string;
	// the name of the track
	private _title: string; 
	
	// something that identifies or credits the author
	private _attribution: string;

	// all of the words of the track. All space characters should be replace with single space.
	private _fullText: string;

	private _wordTimings: { word: string; time: number }[] = [];

	get transcriptId(): string { return this._transcriptId }
	get title(): string { return this._title }
	get attribution(): string { return this._attribution }
	get fullText(): string { return this._fullText }
	get wordTimings(): { word: string; time: number }[] { return this._wordTimings }
	get length(): number { return this._wordTimings.length }
	get json(): {} {
		let _json = {};
		if (this._transcriptId) _json['transcriptId'] = this._transcriptId;
		if (this._title) _json['title'] = this._title;
		if (this._fullText) _json['fullText'] = this._fullText;
		if (this._wordTimings) _json['wordTimings'] = this._wordTimings;
		return _json;
	}
	get words(): string[] {
		let _words = [];
    if(this._wordTimings){
      for (let i = 0; i < this.length; i++){
        _words.push(this.getWordAt(i));
      }
      return _words;
    } else {
      return null;
    }
  }

	constructor (transcriptDoc: {}, transcriptId?: string) {
		if (transcriptId) this._transcriptId = transcriptId;

		if (transcriptDoc['wordTimings']) this._wordTimings = transcriptDoc['wordTimings']	

		if (transcriptDoc['fullText']){
			this._fullText = transcriptDoc['fullText'];
			if (this._wordTimings == null) {
				let words:string[] = this.fullText.split(' ');
				for (let i = 0; i < words.length; i++) {
					this.wordTimings.push({
						'word': words[i],
						'time': null
					});
				}
			}
		}
		if (transcriptDoc['attribution']) this._attribution = transcriptDoc['attribution'];
		
		if (transcriptDoc['title']) this._title = transcriptDoc['title'];
		
	}
	

	getWordAt(index: number): string {
		if (index >= 0 && index < this.wordTimings.length) {
			return this.wordTimings[index].word;
		} else {
			return '';
		}
	}

	getTimeAt(index: number): number {
		if (index >= 0 && index < this.wordTimings.length) {
			return this.wordTimings[index].time;
		} else {
			return null;
		}
	}

	setTimeAt(index: number, time: number): void {
		if (index >= 0 && index < this.wordTimings.length) {
			this.wordTimings[index].time = time;
		}
	}
}