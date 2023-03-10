const { request, response } = require('express');
const Factura = require('../models/factura');


const getFacturas = async (req = request, res = response) => {

    const listaFactura = await Promise.all([
        Factura.countDocuments(),
        Factura.find().populate('admin', 'nombre').populate('cliente', 'nombre').populate('carrito'),

    ]);

    res.json({
        msg: 'GET API Facturas',
        listaFactura
    });

}

const getFacturaPorID = async (req = request, res = response) => {
    const { id } = req.params;
    const facturaById = await Factura.findById(id).populate('admin', 'nombre').populate('cliente', 'nombre').populate('carrito');

    res.status(201).json({
        msg: 'GET Facturas por ID',
        facturaById
    });

}

const postFactura = async (req = request, res = response) => {

    const { admin, ...body } = req.body;

    const facturaDB = await Factura.findOne({ codigo: body.codigo });

    //validacion si el producto ya existe
    if ( facturaDB ) {
        return res.status(400).json({
            msg: `La factura ${ facturaDB.codigo }, ya existe en la DB`
        });
    }


    //Generar la data a guardar
    const data = {
        ...body,
        codigo: body.codigo.toUpperCase(),
        admin: req.usuario._id
    }

    const factura = await Factura( data );

    //Guardar en DB
    await factura.save();

    res.status(201).json({
        msg: 'POST API Factura',
        factura
    });

}


module.exports = {
    getFacturas,
    getFacturaPorID,
    postFactura
}