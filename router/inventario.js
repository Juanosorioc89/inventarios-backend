const { Router } = require('express');
const Inventario = require('../models/Inventario');
const {validationResult, check } = require('express-validator');
const { validateJWT } = require('../midelware/validar-jwt');
const { validateRoleAdmin }  = require('../midelware/validar-rol-admin');


const router = Router();

router.post('/', [validateJWT, validateRoleAdmin], [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),

], async function(req, res){

    

    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({ mensaje : errors.array() })
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
        if(existeInventarioPorSerial){
            return res.status(400).send('Ya existe serial en otro equipo');
        }

        let inventario = new Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear inventario');
    }

})

router.get('/', validateJWT, async function (req, res){
    try{
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado'
            },
            {
                path: 'tipoEquipo', select: 'nombre estado'
            },
            {
                path: 'estadoEquipo', select: 'nombre estado'
            }])
        res.send(inventarios);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
})

// Actualizar inventario
router.put('/:inventarioId', [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),

], async function(req, res){

    try{  
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ mensaje : errors.array()})
        }

        let inventario = await Inventario.findById(req.params.inventarioId)
        if(!inventario){
            return res.status(400).send('Usuario no existe');
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial });
        if(existeInventarioPorSerial){
            return res.status(400).send('Ya existe serial en otro equipo');
        }

        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.foto = req.body.foto;
        inventario.color = req.body.color;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();
        res.send(inventario);

    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear inventario')

    }
})

module.exports = router;