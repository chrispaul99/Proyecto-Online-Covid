//Dependences
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as functions from "firebase-functions";
import * as cors from 'cors';
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://seguimiento-covid-online.firebaseio.com"
});

//Controllers
const MedicalController = require("./controllers/MedicalController");
const PacientController = require("./controllers/PacientController");
const ClinicHistoryController = require("./controllers/ClinicHistoryController");
const RegisterCovidController = require("./controllers/RegisterCovidController");

 // Express
const app = express();
app.use(cors({origin: true}));

//Imports Routers
app.use("/medical",MedicalController);
app.use("/pacient",PacientController);
app.use("/clinic-history",ClinicHistoryController);
app.use("/register-covid",RegisterCovidController);

exports.api = functions.https.onRequest(app);
