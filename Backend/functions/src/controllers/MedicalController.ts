//Dependences
import * as admin from 'firebase-admin';

//Models
import {Medical} from "../models/Medical";

//Firebase Settings
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://seguimiento-covid-online.firebaseio.com"
});
const db = admin.firestore();
const router = require("express").Router();



//Services
router.post("/create",async (req:any, res:any) => {
    let medical:Medical = new Medical();
    medical.name = req.body.name;
    medical.lastname = req.body.name;
    medical.availability = req.body.availability;
    medical.city = req.body.city;
    medical.consultation = req.body.consultation;
    medical.days = req.body.days;
    medical.especiality = req.body.especiality;
    medical.experience = req.body.experience;
    medical.identification = req.body.identification;
    medical.phone = req.body.phone;
    medical.schedule= req.body.schedule;
    await checkMedicalExists(medical.identification).get().then(docSnapshot => {
        if (!docSnapshot.exists) {
            const newMedicalRef = db.collection('medicals').doc(medical.identification);
            newMedicalRef.set(JSON.parse(JSON.stringify(medical))).then(response => { // medical created
                res.json({
                    success: true,
                    message: 'Registro de Médico Exitoso',
                })
            }).catch(e => { // error creating medical
                res.json({
                    success: false,
                    message: 'Error en registro de médico'
                })
            });
        } 
        else {
            res.json({ // Médico Existente
                success: false,
                message: 'El médico con documento de identidad:'+medical.identification+' ya existe'
            })
        }
    });
});
router.put("/update",async (req:any, res:any) => {
    let medical:Medical = new Medical();
    medical.name = req.body.name;
    medical.lastname = req.body.lastname;
    medical.availability = req.body.availability;
    medical.city = req.body.city;
    medical.consultation = req.body.consultation;
    medical.days = req.body.days;
    medical.especiality = req.body.especiality;
    medical.experience = req.body.experience;
    medical.identification = req.body.identification;
    medical.phone = req.body.phone;
    medical.schedule= req.body.schedule;
    const updateMedicalRef = db.collection('medicals').doc(medical.identification);
        updateMedicalRef.update(JSON.parse(JSON.stringify(medical)))
        .then(response => { // medical created
            res.json({
                success: true,
                message: 'Actualización de Médico exitosa',
            })
        }).catch(e => { // error creating medical
            res.json({
                success: false,
                message: 'Error en actualización de médico'
            })
        });
});
router.get("/all",async (req:any, res:any) => {
    const ref = db.collection("medicals");
    const doc = await ref.get();
    let medicalist:Medical[]=[];
    doc.docs.map(doc=>{
        let medico = doc.data() as Medical;
        medicalist.push(medico);
    });
    res.json({
        success: true,
        data: medicalist
    });
});
router.get("/:id", async (req:any, res:any) => {
    const ref = db.collection("medicals");
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let medico = doc.data() as Medical;
        if(medico.identification==req.params.id){
            res.json({
                success: true,
                data: medico
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún médico con el documento de identificación '+req.params.id
    });
    
});
router.put("/downmedical/:id",async (req:any, res:any) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.update({
        availability:false
    }).then(response => { // medical down
        res.json({
            success: true,
            message: 'Baja temporal de Médico',
        })
    }).catch(e => { // error down medical
        res.json({
            success: false,
            message: 'Error en la baja temporal del Médico'
        })
    });
});
router.put("/upmedical/:id",async (req:any, res:any) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.update({
        availability:true
    }).then(response => { // medical up
        res.json({
            success: true,
            message: 'Baja temporal de Médico',
        })
    }).catch(e => { // error up medical
        res.json({
            success: false,
            message: 'Error en la baja temporal del Médico'
        })
    });
});

router.delete("/delete/:id",async (req:any, res:any) => {
    const ref = db.collection("medicals").doc(req.params.id);
    ref.delete().then(response => { // medical delete forever
        res.json({
            success: true,
            message: 'El Médico ha sido eliminado definitivamente del sistema',
        })
    }).catch(e => { // error delete medical forever
        res.json({
            success: false,
            message: 'Error al eliminar al Médico'
        })
    });
});

//Functions
function checkMedicalExists(identification: string) {
    return db.collection('medicals').doc(identification);
}

module.exports = router;
