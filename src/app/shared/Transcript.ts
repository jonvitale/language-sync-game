export class Transcript {

	private transcript: { word: string; time: number }[] = [];

	constructor (private text:string) {
		let words:string[] = text.split(' ');
		for (let i = 0; i < words.length; i++) {
			this.transcript.push({
				'word': words[i],
				'time': null
			});
		}
	}

	get length(): number {
		return this.transcript.length;
	}

	getWordAt(index: number): string {
		if (index >= 0 && index < this.transcript.length) {
			return this.transcript[index].word;
		} else {
			return '';
		}
	}

	getTimeAt(index: number): number {
		if (index >= 0 && index < this.transcript.length) {
			return this.transcript[index].time;
		} else {
			return null;
		}
	}

	setTimeAt(index: number, time: number): void {
		if (index >= 0 && index < this.transcript.length) {
			this.transcript[index].time = time;
		}
	}
}