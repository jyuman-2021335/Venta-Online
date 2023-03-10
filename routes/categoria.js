//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categoria');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener todas las categorias - público
router.get('/', obtenerCategorias);

// Obtener una categoria por el id - público
router.get('/:id', [
    check('id', 'No es un id de mongo DB válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaPorId);

// Crear categoria - privado - cualquier persona con un token valido puede realizar dicha funcion
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre  de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar categorias - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo DB válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('nombre', 'El nombre  de la categoria es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - privado - se requiere id y un token valido
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], borrarCategoria);


module.exports = router;