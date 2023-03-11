const { request, response } = require('express');


const esAdminRole = ( req = require, res = response, next ) => {

    if ( !req.usuario ) {
        return  res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });

    }

    //Verificacion solo el rol de admin puede realizar la eliminacion
    //Si cumple con el rol de admin se envia al controlador deleteUsuario
    const { rol, nombre } = req.usuario
    if ( rol !== 'ADMIN' ) {
        return  res.status(401).json({
            msg: `${ nombre }, no es admin - No puede hacer esto`
        });
    }

    next();

}

module.exports = {
    esAdminRole 
}