const { Router } = require('express');
const { check } = require('express-validator');
const { getProductos, getProductoPorID, postProducto, putProducto, deleteProducto, getProductosAgotados, getProductosMasvendidos, buscarProductos } = require('../controllers/producto');
const { existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();


router.get('/mostrar', getProductos);

router.get('/agotados',[
    validarJWT,
    //esAdminRole
], getProductosAgotados);

router.get('/masVendidos', getProductosMasvendidos);

router.get('/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], getProductoPorID);
    
router.post('/agregar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postProducto);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    validarCampos
], putProducto);

router.delete('/eliminar/:id',[
    validarJWT, 
    //esAdminRole,
    check('id', 'No es un id valido.').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto);

router.get('/:termino' ,buscarProductos);

module.exports = router;