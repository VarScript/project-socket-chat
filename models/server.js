const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');   

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/sockets-controller');



class Server {
    constructor() {
        this.app = express(); 
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            users: '/api/user',
            uploads: '/api/uploads',
        };
        

        // Connect databade
        this.connectDB();

        // Middleware: functions that go add other functionality to my webserver
        this.middleware();

        // Routes of my application
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middleware() {
        // CORS
        this.app.use(cors());

        // Reading and parsing of body - for show in user.controller
        this.app.use( express.json() );

        // Public directory
        this.app.use( express.static('public')); // use: is the clave word

        // File upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    // Routes that i wanna
    routes() {
        
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.users, require('../routes/users.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));

    }

    sockets() {
        this.io.on("connection", ( socket ) => socketController( socket, this.io ) )
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Server runing in the port: ', this.port);
        });
    }
}



module.exports = Server;