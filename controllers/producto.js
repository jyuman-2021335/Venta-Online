const { request, response } = require('express');
const Producto = require('../models/producto')
const { ObjectId } = require('mongoose').Types;


const getProductos = async (req = request, res = response) => {

    const query = { disponible: true };

    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'GET API de Productos',
        listaProducto
    });

}

const getProductoPorID = async (req = request, res = response) => {

    const { id } = req.params;
    const productoById = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')


    res.status(201).json({
        msg: 'Producto por ID',
        productoById
    });

}

const postProducto = async (req = request, res = response) => {

    const { usuario, disponible, ventas, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    //validacion si el producto ya existe
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe en la DB`
        });
    }

    //Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data );

    //Guardar en DB
    await producto.save();

    res.status(201).json({
        msg: 'POST API de Productos',
        producto
    });
   
}

const putProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const { _id, usuario, ventas, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
    }

    restoData.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, ({ new: true }));

    res.status(201).json({
        msg: 'PUT API de Productos',
        productoActualizado
    });
}

const deleteProducto = async (req = request, res = response) => {
    
    const {id} = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate(id, {disponible: false}, {new: true});
    
    res.json({
        msg: "DELETE API de Productos",
        productoEliminado
    });
}

const getProductosAgotados = async (req = request, res = response) => {

    //condiciones del get
    const query = { disponible: false };

    const listaProductosAgotados = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'Productos Agotados:',
        listaProductosAgotados
    });

}

const getProductosMasvendidos = async (req = request, res = response) => {

    const query = await Producto.find().sort({ventas: -1}).limit(10);

    res.status(201).json({
        msg: "Productos más Vendidos:",
        query
    })

}


module.exports = {
    getProductos,
    getProductoPorID,
    postProducto,
    putProducto,
    deleteProducto,
    getProductosAgotados,
    getProductosMasvendidos
}