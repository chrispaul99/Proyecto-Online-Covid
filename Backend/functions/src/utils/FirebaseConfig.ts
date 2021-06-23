// Dependences
import * as admin from 'firebase-admin';

const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://seguimiento-covid-online.firebaseio.com"
});
const db = admin.firestore();

module.exports = db;