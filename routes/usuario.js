//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, postUsuario, putUsuario, deleteUsuario, registroUsuario, getComprasUsuario, deleteMiUsuario, editarMiUsuario } = require('../controllers/usuario');
const { emailExiste, esRoleValido, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getUsuarios);

router.get('/compras', [
    validarJWT,
], getComprasUsuario);

router.post('/registro', [
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('password', 'la password es obligatoria para el post').not().isEmpty(),
    check('password', 'La passward debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], registroUsuario);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('password', 'la password es obligatoria para el post').not().isEmpty(),
    check('password', 'La passward debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol', 'El rol es obligatorio para el post').not().isEmpty(),
    check('rol').custom(esRoleValido),
    validarCampos
] , postUsuario);


router.put('/editar/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password', 'la password es obligatoria para el post').not().isEmpty(),
    check('password', 'La passward debe ser mayor a 6 letras').isLength({ min: 6 }),
    validarCampos
], putUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], deleteUsuario);

router.put('/editarMiUsuario/:id',[
    validarJWT
], editarMiUsuario)

router.delete('/eliminarMiUsuario/:id',[
    validarJWT
], deleteMiUsuario);


module.exports = router;