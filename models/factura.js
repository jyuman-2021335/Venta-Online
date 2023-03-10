const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    codigo: {
        type: String,
        required: [true , 'El código de la factura es obligatorio']
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    carrito: {
        type: Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true
    }
});


module.exports = model('Factura', FacturaSchema);