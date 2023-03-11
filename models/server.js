//Configuración del server
//Importaciones básicas
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor(){
        //Variables de configuración
        this.app = express();
        this.port = process.env.PORT;
        // this.usuarioPath = '/api/usuarios';
        // this.authPath = '/api/auth';

        this.paths = {
            auth: '/api/auth',
            usuario: '/api/usuarios',
            categoria: '/api/categorias',
            productos: '/api/productos',
            carritos: '/api/carritos',
            facturas: '/api/facturas',
            buscar: '/api/buscar',
        }

        //Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middlewares();
        
        //Rutas de mi app
        this.routes();

    }


    //Metodo de conección a Mongo
    async conectarDB(){
        await dbConection();
    }

    
    middlewares(){

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio publico del proyecto
        this.app.use(  express.static('public') );

    }


    routes(){
        this.app.use( this.paths.auth , require('../routes/auth'));
        this.app.use( this.paths.categoria, require('../routes/categoria'));
        this.app.use(this.paths.productos, require('../routes/producto'));
        this.app.use( this.paths.usuario, require('../routes/usuario'));
        this.app.use(this.paths.carritos, require('../routes/carrito'));
        this.app.use( this.paths.facturas, require('../routes/factura'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    }


    listen(){
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        })
    }


}


module.exports = Server;