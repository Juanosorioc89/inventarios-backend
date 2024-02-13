const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
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

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();
        res.send(estadoEquipo);

    } catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error al crear estado de equipo');
    }
})

router.get('/', [validateJWT, validateRoleAdmin], async function(req, res){
    try{
        const estadosEquipos = await EstadoEquipo.find();
        res.send(estadosEquipos);


    }catch(error){
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
})

router.put('/',[validateJWT, validateRoleAdmin],[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function(req, res) {
    try{
        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
        if(!estadoEquipo){
            return res.send('No existe estado');
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({message: errors.array()});
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();
        res.send(estadoEquipo);

    } catch(error) {
        console.log(error);
        res.status(500).send('Ocurrió un error');
    }
});

module.exports = router;
