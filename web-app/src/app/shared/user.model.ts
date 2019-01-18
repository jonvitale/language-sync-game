import { Transcript } from './transcript.model';

export class User {
	// a user name set by user
	private _userId: string;
	private _userName: string;
	private _dateCreated: Date;
	private _transcripts: Transcript[];

	public get userName(): string {return this._userName}

	constructor (userDoc:{}, userId?: string) {
		console.log("inside user constructor", userId, userDoc);
		if (userId) this._userId = userId;
		if (userDoc['userName'] != null){
			this._userName = userDoc['userName'];
		}
		if (userDoc['dateCreated'] != null){
			this._dateCreated = userDoc['dateCreated'];
		}
	}
}