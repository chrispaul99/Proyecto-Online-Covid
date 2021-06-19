//Dependences
import * as express from 'express';
import * as functions from "firebase-functions";
import * as cors from 'cors';

//Controllers
const MedicalController = require("./controllers/MedicalController");

 // Express
const app = express();
app.use(cors({origin: true}));

//Imports Routers
app.use("/medical",MedicalController);

exports.api = functions.https.onRequest(app);
