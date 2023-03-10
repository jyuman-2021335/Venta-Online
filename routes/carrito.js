const { Router } = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito} = require('../controllers/carrito');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT} = require('../middlewares/validar-jwt');
const { validarStock } = require('../middlewares/validar-stock');

const router = Router();

router.get('/mostrar', getCarrito);

router.post('/agregar',[
    validarJWT,
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
    validarStock
], postCarrito);


module.exports = router;