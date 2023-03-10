const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El contraseña es obligatorio']
    },
    rol: {
        type: String,
        required: true,
        default: 'CLIENT'
    },
    estado: {
        type: Boolean,
        default: true
    },
    compras: [{
        type: Schema.Types.ObjectId,
        ref: 'Factura',
        required: true
    }]
});

module.exports = model('Usuario', UsuarioSchema)