//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, borrarCategoria} = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [
    check('id', 'No es un id de mongo DB válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaPorId);

router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre  de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo DB válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre  de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);


router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);



module.exports = router;