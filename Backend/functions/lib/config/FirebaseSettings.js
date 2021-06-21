"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://seguimiento-covid-online.firebaseio.com"
});
const db = admin.firestore();
module.exports = db;
//# sourceMappingURL=FirebaseSettings.js.map