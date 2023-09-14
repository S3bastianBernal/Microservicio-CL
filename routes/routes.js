const express = require('express');

const {MongoClient} = require('mongodb');
require('dotenv').config();
const router = express.Router();

const client = new MongoClient(process.env.MONGODATA4875)
const db = client.db('Microservicio');


/* Endpoint 1:Obtener todos los pacientes de manera alfabética. */

router.get('/ejercicio1/', async (req, res) => {
    try {
        await client.connect();
        //Hacemos un sort para ordenar los nombres de los usuarios y le ponesmos 1 para que sea de a-z
        const pacientes = await db.collection('usuarios').find({}).sort({nombres: 1}).toArray();
        res.json(pacientes);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


/* Endpoint 3: Obtener todos los médicos de una especialidad en específico (por ejemplo, ‘Cardiología’). */

router.get('/ejercicio3/', async (req,res) =>{
    try {
        await client.connect();
        //hacemos un find y ponemos de filtro que solo busque los que sean especializados en Cardiologia
        const result = await db.collection('medicos').find({especialidad: "Cardiología"}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

/* Endpoint 4: Encontrar la próxima cita para un paciente en específico */

router.get('/ejercicio4/', async (req, res) => {
    try {
        await client.connect();
        const usuario = await db.collection('usuarios').find({nombres: "Carlos"}).toArray();
        const test = await db.collection('citas').find({datosUsuario: usuario[0].email}).sort({fecha: 1}).toArray()
        res.json(test);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})



/* Endpoint 6: Encontrar todas las citas de un día en específico */

router.get('/ejercicio6/', async (req, res) => {
    try {
        await client.connect();
        // al poner yo hora en la fecha uso regex para que solo busque el dato de la fecha
        const result = await db.collection('citas').find({fecha: {$regex: "2023-09-15"}}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

/* Endpoint 7: Obtener todos los médicos con sus consultorios correspondientes. */

router.get('/ejercicio7/', async (req, res) => {
    try {
        await client.connect();
        const result = await db.collection('medicos').find({}).toArray();
        const data = [];
        result.forEach(element => {
            const {nombreCompleto,consultorio} = element;
            data.push({nombreCompleto,consultorio})
        });
        console.log(data);
        res.json(data);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

/* Endpoint 8: Contar el número de citas que un médico tiene en un día específico */

router.get('/ejercicio8/',  async (req, res) => {
    try {
        await client.connect();
        const result = await db.collection('citas').countDocuments({fecha: {$regex: "2023-09-15"}});
        res.json(result);
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


/* Endpoint 12: Mostrar todas las citas que fueron rechazadas de un mes en específico. Dicha consulta deberá mostrar la fecha de la cita, el nombre del usuario y el médico designado. */

router.get('/ejercicio12/', async (req, res) => {
    try {
        await client.connect();
        const mes = await db.collection('citas').find({fecha: {$regex: "-08-"}}).toArray();
        const result = [];
        mes.forEach(element => {
            const {fecha,datosUsuario,estadoCita,medico} = element;
            if (estadoCita === "Cancelada") {
                result.push({fecha,datosUsuario,medico})
            }
        });
        if (result.length > 0) {
            res.json({msg: "Citas Canceladas este mes", data: result});
        }else {
            res.json({msg: "No se cancelaron citas este mes"});
        }
        client.close();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});






module.exports = router