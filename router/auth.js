const { Router } = require('express');
const Usuario = require('../models/Usuario');
const {validationResult, check } = require('express-validator');
const bycript = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt');

const router = Router();

router.post('/', [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),

], async function(req, res){

    try{  
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ mensaje : errors.array()})
        }

        const usuario = await Usuario.findOne({ email: req.body.email})
        if (isuario) {
            return res.status(400).json({ mensaje: 'user not found'});

        }

        const esIgual= bycript.compareSync(req.body.password, usuario.password);
        if(!esIgual){
            return res.status(400).json({ mensaje: 'user not found'});
        }

        const token = generarJWT(usuario);

        res.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email, access_token: token
        });

    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear usuario')

    }
})

router.get('/', async function(req, res){
    try{
        const usuarios = await Usuario.find();
        res.send(usuarios);

    } catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error')
    }
})

router.put('/:usuarioId', [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

], async function(req, res){

    try{  
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ mensaje : errors.array()})
        }

        let usuario = await Usuario.findById(req.params.usuarioId)
        if(!usuario){
            return res.status(400).send('Usuario no existe');
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email, _id: { $ne: usuario._id}})
        if (existeUsuario) {
            return res.status(400).send('Email ya existe')

        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.rol = req.body.rol;
        usuario = req.body.password;

        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();
        res.send(usuario);

    }catch(error){
        console.log(error);
        res.status(500).send('Ocurrió un error al crear usuario')

    }
})

module.exports = router;