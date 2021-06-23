import * as admin from 'firebase-admin';
// Models
import {Clinic_History } from '../models/ClinicHistory';
// Firebase Settings
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create",async (req:any, res:any) => {
    let clinic_History:Clinic_History = new Clinic_History();
    clinic_History = req.body as Clinic_History;
    clinic_History.id_history = clinic_History.pacient.identification;
    await checkClinicHistoryExists(clinic_History.id_history).get().then(docSnapshot => {
        if (!docSnapshot.exists) {
            const newClinicHistoryRef = db.collection('clinic_histories').doc(clinic_History.id_history);
            newClinicHistoryRef.set(JSON.parse(JSON.stringify(clinic_History))).then(response => { // Clinic_History created
                res.json({
                    success: true,
                    message: 'Registro de Historia Clínica Exitosa',
                })
            }).catch(e => { // error creating Clinic_History
                res.json({
                    success: false,
                    message: 'Error en registro de Historia Clínica'
                })
            });
        } 
        else {
            res.json({ // Médico Existente
                success: false,
                message: 'La historia clínica con documento de identidad:'+clinic_History.id_history+' ya existe'
            })
        }
    });
});
router.put("/update",async (req:any, res:any) => {
    let clinic_History:Clinic_History = new Clinic_History();
    clinic_History = req.body as Clinic_History;
    const updateClinicHistoryRef = db.collection('clinic_histories').doc(clinic_History.id_history);
        updateClinicHistoryRef.update(JSON.parse(JSON.stringify(clinic_History)))
        .then(response => { // Clinic_History created
            res.json({
                success: true,
                message: 'Actualización de Historia Clínica exitosa',
            })
        }).catch(e => { // error creating Clinic_History
            res.json({
                success: false,
                message: 'Error en actualización de Historia Clínica'
            })
        });
});
router.get("/all",async (req:any, res:any) => {
    const ref = db.collection("clinic_histories");
    const doc = await ref.get();
    let clinicList:Clinic_History[]=[];
    doc.docs.map(doc=>{
        let clinic = doc.data() as Clinic_History;
        clinicList.push(clinic);
    });
    res.json({
        success: true,
        data: clinicList
    });
});
router.get("/:id", async (req:any, res:any) => {
    const ref = db.collection('clinic_histories');
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let history = doc.data() as Clinic_History;
        if(history.id_history==req.params.id){
            res.json({
                success: true,
                data: history
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ninguna historia clínica con el documento de identificación '+req.params.id
    });
    
});

router.delete("/delete/:id",async (req:any, res:any) => {
    const ref = db.collection("clinic_Histories").doc(req.params.id);
    ref.delete().then(response => { // Clinic_History delete forever
        res.json({
            success: true,
            message: 'La historia de usuario ha sido eliminada definitivamente del sistema',
        })
    }).catch(e => { // error delete Clinic_History forever
        res.json({
            success: false,
            message: 'Error al eliminar al Historia Clinica'
        })
    });
});

// Functions
function checkClinicHistoryExists(identification: string) {
    return db.collection('clinic_histories').doc(identification);
}

module.exports = router;
