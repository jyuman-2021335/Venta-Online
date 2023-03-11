const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const coleccionesPermitidas = [
    'categorias',
    'productos'
];


const buscarProductos = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino );  

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: ( producto ) ? [ producto ] : [] 
        });
    } 

    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find({
        $or: [ { nombre: regex }],
        $and: [ { disponible: true } ]
    });

    res.json({
        results: productos
    })

}

const buscarCategorias = async( termino = '', res = response) => {

    const esMongoID = ObjectId.isValid( termino ); 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : [] 
        });
    } 

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({
        $or: [ { nombre: regex }],
        $and: [ { estado: true } ]
    });

    res.json({
        results: categorias
    })

}


const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }


    switch (coleccion) {
        case 'categorias':
           buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
    }

}


module.exports = {
    buscar
}