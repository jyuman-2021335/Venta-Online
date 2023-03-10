const { response, request } = require("express");

const Carrito = require("../models/carrito");
const Producto = require("../models/producto");

const getCarrito = async (req = request, res = response) => {
  //condiciones del get
  const query = { estado: true };

  const listaCarritos = await Promise.all([
    Carrito.countDocuments(query),
    Carrito.find(query).populate("usuario", "nombre").populate("productos"),
  ]);

  res.json({
    msg: "GET API Carrito",
    listaCarritos,
  });
};

const postCarrito = async (req = request, res = response) => {
  const carrito = req.body.carrito.toUpperCase();
  const { productos, cantidadProductos } = req.body;
  const carritoDB = await Carrito.findOne({ carrito });
  let totales = 0;
  let totalFinal = 0;

  //Si el carrito existe no lo agrega.
  if (carritoDB) {
    return res.status(400).json({
      msg: `El carrito ${carritoDB.carrito}, ya existe.`,
    });
  }

  for (let i = 0; i < productos.length; i++) {
    const cantidadxProducto = cantidadProductos[i];
    const listaProductos = productos[i];
    const query = await Producto.findById(listaProductos);
    let precio = query.precio;
    let cantidad = parseInt(cantidadxProducto);

    totales = precio * cantidad;

    totalFinal = totales + totalFinal;
  }

  const data = {
    carrito,
    usuario: req.usuario._id,
    total: totalFinal,
  };

  const carritos = new Carrito(data);
  carritos.productos.push(...req.body.productos);

  await carritos.save();
  res.status(201).json({
    msg: 'POST API Carrito',
    carritos
  });
};


module.exports = {
  getCarrito,
  postCarrito
};
