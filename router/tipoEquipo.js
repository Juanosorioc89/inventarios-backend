const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const {validationResult, check } = require('express-validator');
const { validateJWT}  = require('../midelware/validar-jwt');
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

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);

    } catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error al crear tipo de equipo');
    }
})

router.get('/', [validateJWT, validateRoleAdmin], async function(req, res){
    try{
        const tiposEquipos = await TipoEquipo.find();
        res.send(tiposEquipos);


    }catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
})

router.put('/:tipoEquipoId', [validateJWT, validateRoleAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ mensaje : errors.array()})
        }

        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
        if(!tipoEquipo){
            return res.status(400).send('No existe tipo de equipo')
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);

    } catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error al crear tipo de equipo');
    }
})


module.exports = router;
