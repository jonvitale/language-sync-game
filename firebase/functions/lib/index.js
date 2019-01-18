"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const gcs = require("@google-cloud/storage");
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Vitale Firebase!");
    console.log(gcs);
});
//# sourceMappingURL=index.js.map