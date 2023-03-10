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
    productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    }],
    total: {
        type: Number,
        default: 0
    }
});


module.exports = model('Factura', FacturaSchema);