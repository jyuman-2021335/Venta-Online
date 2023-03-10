//Importacion
const { response, request } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const obtenerCategorias = async(req = request, res = response) => {
    //Condición, me busca solo las categorias que tengan estado en true
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'GET API de Categorias',
        listaCategorias
    });
}

const obtenerCategoriaPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({
        msg: 'Categoria por ID',
        categoria
    });
}

const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const descripcion = req.body.descripcion.toUpperCase();

    //Validación para encontrar una categoria por nombre en la DB
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria  ${categoriaDB.nombre}, ya existe en la DB`
        });
    }

    //Generar la data(información a almacenar en la base de datos) a guardar
    const data = {
        nombre,
        descripcion,
        usuario: req.usuario._id
    }

    const categoriaAgregada = new Categoria(data);

    //Guardar en la base de datos
    await categoriaAgregada.save();

    res.status(201).json({
        msg: 'Post de Categoria',
        categoriaAgregada
    });
}

const actualizarCategoria = async(req = request, res = response) => {

    const { id } = req.params;
    const {_id, estado, usuario, ...data} = req.body; // el ... es el operador de express

    data.nombre = data.nombre.toUpperCase();     //Cambiamos todo a mayúsculas
    data.descripcion = req.body.descripcion.toUpperCase();
    data.usuario = req.usuario._id; //Hacemos referencia al  usuario que hizo el put por medio del token

    //Edición de categoría
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}); //new: true  Sirve para enviar el nuevo documento actualizado

    res.json({
        msg: 'PUT de Categoria',
        categoria
    });
}

const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const query = { categoria: id };
    const productos = await Producto.find(query);
    const productoId = productos.map((product) => product._id);
    const idA = req.usuario.id;

    const colleccion = "Categoria";
    const categoriaDB = await Categoria.findOne({ nombre: colleccion });

    if (!categoriaDB) {
        const deleteCategoria = new Categoria({
            nombre: "Categoria",
            usuario: idA,
        });

        await deleteCategoria.save();
    }

    const querys = { nombre: "Categoria" };
    const { _id } = await Categoria.findOne(querys);

    const editado = await Producto.updateMany({ categoria: id }, { categoria: _id });

    const categoriaBorrada = await Categoria.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE Categoria',
        categoriaBorrada
    });
}


module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}