"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Dependences
const admin = require("firebase-admin");
// Models
const Medical_1 = require("../models/Medical");
// Firebase Settings
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://seguimiento-covid-online.firebaseio.com"
});
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create", async (req, res) => {
    let medical = new Medical_1.Medical();
    medical = req.body;
    await checkMedicalExists(medical.identification).get().then(docSnapshot => {
        if (!docSnapshot.exists) {
            const newMedicalRef = db.collection('medicals').doc(medical.identification);
            newMedicalRef.set(JSON.parse(JSON.stringify(medical))).then(response => {
                res.json({
                    success: true,
                    message: 'Registro de Médico Exitoso',
                });
            }).catch(e => {
                res.json({
                    success: false,
                    message: 'Error en registro de médico'
                });
            });
        }
        else {
            res.json({
                success: false,
                message: 'El médico con documento de identidad:' + medical.identification + ' ya existe'
            });
        }
    });
});
router.put("/update", async (req, res) => {
    let medical = new Medical_1.Medical();
    medical = req.body;
    const updateMedicalRef = db.collection('medicals').doc(medical.identification);
    updateMedicalRef.update(JSON.parse(JSON.stringify(medical)))
        .then(response => {
        res.json({
            success: true,
            message: 'Actualización de Médico exitosa',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en actualización de médico'
        });
    });
});
router.get("/all", async (req, res) => {
    const ref = db.collection("medicals");
    const doc = await ref.get();
    let medicalist = [];
    doc.docs.map(doc => {
        let medico = doc.data();
        medicalist.push(medico);
    });
    res.json({
        success: true,
        data: medicalist
    });
});
router.get("/:id", async (req, res) => {
    const ref = db.collection("medicals");
    const doc = await ref.get();
    doc.docs.map(doc => {
        let medico = doc.data();
        if (medico.identification == req.params.id) {
            res.json({
                success: true,
                data: medico
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún médico con el documento de identificación ' + req.params.id
    });
});
router.put("/downmedical/:id", async (req, res) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.update({
        availability: false
    }).then(response => {
        res.json({
            success: true,
            message: 'Baja temporal de Médico',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en la baja temporal del Médico'
        });
    });
});
router.put("/upmedical/:id", async (req, res) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.update({
        availability: true
    }).then(response => {
        res.json({
            success: true,
            message: 'Baja temporal de Médico',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error en la baja temporal del Médico'
        });
    });
});
router.delete("/delete/:id", async (req, res) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.delete().then(response => {
        res.json({
            success: true,
            message: 'El Médico ha sido eliminado definitivamente del sistema',
        });
    }).catch(e => {
        res.json({
            success: false,
            message: 'Error al eliminar al Médico'
        });
    });
});
// Functions
function checkMedicalExists(identification) {
    return db.collection('medicals').doc(identification);
}
module.exports = router;
//# sourceMappingURL=MedicalController.js.map