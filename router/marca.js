const { Router } = require('express');
const Marca = require('../models/Marca');
const {validationResult, check } = require('express-validator');
const { validateJWT }  = require('../midelware/validar-jwt');
const { validateRoleAdmin }  = require('../midelware/validar-rol-admin');

const router = Router();

router.post('/', [validateJWT, validateRoleAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ mensaje : errors.array()})
        }

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();
        res.send(marca);

    } catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error al crear marca');
    }
})

router.get('/', [validateJWT, validateRoleAdmin], async function(req, res){
    try{
        const marcas = await Marca.find();
        res.send(marcas);


    }catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
})

module.exports = router;
