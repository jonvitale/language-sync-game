import * as functions from 'firebase-functions';
import * as gcs from '@google-cloud/storage';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
 // response.send("Hello from Vitale Firebase!");
 // console.log(gcs);
 let storage = new gcs.Storage();
 let bucket = new gcs.Bucket(storage, 'language-sync-game');
 bucket.file('transcripts/inspiegato.txt');
});
