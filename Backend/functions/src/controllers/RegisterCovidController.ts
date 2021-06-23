import * as admin from 'firebase-admin';
const { v4: uuidv4 } = require('uuid');
// Models
import {RegisterCovid} from "../models/RegisterCovid";
// Firebase Settings
const db = admin.firestore();
const router = require("express").Router();
// Services
router.post("/create/:history",async (req:any, res:any) => {
    let registerCovid:RegisterCovid = new RegisterCovid();
    let ban = false;
    registerCovid = req.body as RegisterCovid;
    do{
        registerCovid.id_register = generateID();
        await checkRegisterExists(req.params.history, registerCovid.id_register).get().then(docSnapshot => {
            if (!docSnapshot.exists) {
                ban=false;
                const newRegisterCovidyRef = db.collection('clinic_histories').doc(req.params.history).collection('registations_covid').doc(registerCovid.id_register);
                newRegisterCovidyRef.set(JSON.parse(JSON.stringify(registerCovid))).then(response => { // RegisterCovid created
                    res.json({
                        success: true,
                        message: 'Registro de Seguimiento COVID Exitosa',
                    })
                }).catch(e => { // error creating RegisterCovid
                    res.json({
                        success: false,
                        message: 'Error en registro de Seguimiento COVID'
                    })
                });
            } 
            else {
                ban = true;
            }
        });
    }while(ban);
});
router.put("/update/:history/:id",async (req:any, res:any) => {
    let registerCovid:RegisterCovid = new RegisterCovid();
    registerCovid = req.body as RegisterCovid;
    const updateRegisterCovidyRef = db.collection('clinic_histories').doc(req.params.history).collection('registations_covid').doc(req.params.id);
        updateRegisterCovidyRef.update(JSON.parse(JSON.stringify(registerCovid)))
        .then(response => { // RegisterCovid created
            res.json({
                success: true,
                message: 'Actualización de Seguimiento COVID exitosa',
            })
        }).catch(e => { // error creating RegisterCovid
            res.json({
                success: false,
                message: 'Error en actualización de Seguimiento COVID'
            })
        });
});
router.get("/:history/all",async (req:any, res:any) => {
    const ref = db.collection("clinic_histories").doc(req.params.history).collection('registations_covid');
    const doc = await ref.get();
    let registerList:RegisterCovid[]=[];
    doc.docs.map(doc=>{
        let register = doc.data() as RegisterCovid;
        registerList.push(register);
    });
    res.json({
        success: true,
        data: registerList
    });
});
router.get("/:history/:id", async (req:any, res:any) => {
    const ref =  db.collection('clinic_histories').doc(req.params.history).collection('registations_covid');
    const doc = await ref.get();
    doc.docs.map(doc=>{
        let registration = doc.data() as RegisterCovid;
        if(registration.id_register==req.params.id){
            res.json({
                success: true,
                data: registration
            });
        }
    });
    res.json({
        success: false,
        message: 'No existe ningun Seguimiento COVID con el identificador '+req.params.id
    });
    
});

router.delete("/delete/:history/:id",async (req:any, res:any) => {
    const ref = db.collection('clinic_histories').doc(req.params.history).collection('registations_covid').doc(req.params.id);
    ref.delete().then(response => { // RegisterCovid delete forever
        res.json({
            success: true,
            message: 'El seguimiento de COVID seleccionado ha sido eliminada definitivamente del sistema',
        })
    }).catch(e => { // error delete RegisterCovid forever
        res.json({
            success: false,
            message: 'Error al eliminar al seguimiento de COVID seleccionado'
        })
    });
});
function generateID():string {
    let myuuid="";
    myuuid = uuidv4();
    return myuuid;
}

function checkRegisterExists(history:string,identification: string) {
    return db.collection('clinic_histories').doc(history).collection('registations_covid').doc(identification);
}
module.exports = router;
