import * as admin from 'firebase-admin';
// Models
import {Pacient} from "../models/Pacient";
// Firebase Settings
const db = admin.firestore();
const router = require("express").Router();

// Services
router.post("/create",async (req:any, res:any) => {
    let pacient:Pacient = new Pacient();
    pacient = req.body as Pacient;
    await checkPacientExists(pacient.identification).get().then(docSnapshot => {
        if (!docSnapshot.exists) {
            const newPacientRef = db.collection('pacients').doc(pacient.identification);
            newPacientRef.set(JSON.parse(JSON.stringify(pacient))).then(response => { // paciente created
                res.json({
                    success: true,
                    message: 'Registro de Paciente Exitoso',
                })
            }).catch(e => { // error creating pacient
                res.json({
                    success: false,
                    message: 'Error en registro de paciente'
                })
            });
        } 
        else {
            res.json({ // Paciente Existente
                success: false,
                message: 'El paciente con documento de identidad:'+pacient.identification+' ya existe'
            })
        }
    });
});
router.put("/update",async (req:any, res:any) => {
    let pacient:Pacient = new Pacient();
    pacient = req.body as Pacient;
    const updatePacientRef = db.collection('pacients').doc(pacient.identification);
        updatePacientRef.update(JSON.parse(JSON.stringify(pacient)))
        .then(response => { // Pacient created
            res.json({
                success: true,
                message: 'Actualización de Paciente exitosa',
            })
        }).catch(e => { // error creating Pacient
            res.json({
                success: false,
                message: 'Error en actualización de Paciente'
            })
        });
});
router.get("/all",async (req:any, res:any) => {
    const ref = db.collection("pacients");
    const doc = await ref.get();
    let pacientList:Pacient[]=[];
    doc.docs.map(doc=>{
        let pacient = doc.data() as Pacient;
        pacientList.push(pacient);
    });
    res.json({
        success: true,
        data: pacientList
    });
});
router.get("/:id", async (req:any, res:any) => {
    const ref = db.collection("pacients");
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let pacient = doc.data() as Pacient;
        if(pacient.identification==req.params.id){
            res.json({
                success: true,
                data: pacient
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningún médico con el documento de identificación '+req.params.id
    });
    
});

router.delete("/delete/:id",async (req:any, res:any) => {
    const ref = db.collection("pacients").doc(req.params.id);
    ref.delete().then(response => { // Pacient delete forever
        res.json({
            success: true,
            message: 'El Médico ha sido eliminado definitivamente del sistema',
        })
    }).catch(e => { // error delete Pacient forever
        res.json({
            success: false,
            message: 'Error al eliminar al Médico'
        })
    });
});

// Functions
function checkPacientExists(identification: string) {
    return db.collection('pacients').doc(identification);
}

module.exports = router;
