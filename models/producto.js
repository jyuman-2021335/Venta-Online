const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del Producto es obligatorio'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0,
        required: true
    },
    cantidad: {
        type: Number,
        default: 1
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    disponible: {
        type: Boolean,
        default: true
    },
    ventas: {
        type: Number,
        default: 1
    }
});

module.exports = model('Producto', ProductoSchema);