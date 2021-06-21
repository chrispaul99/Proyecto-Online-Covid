"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Dependences
const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");
//Controllers
const MedicalController = require("./controllers/MedicalController");
// Express
const app = express();
app.use(cors({ origin: true }));
//Imports Routers
app.use("/medical", MedicalController);
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map