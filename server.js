'use strict';

var Http = require('http');
var Express = require('express');
var BodyParser = require('body-parser');
var Cors = require('cors');
var Swaggerize = require('swaggerize-express');
var SwaggerUi = require('swaggerize-ui');
var Path = require('path');
var socketManager = require('./sockets/socketManager.js');
var changeService = require('./changeService/changeService.js');

var App = Express();
var Server = Http.createServer(App);
var io = require('socket.io')(Server);

App.use(BodyParser.json());
App.use(BodyParser.urlencoded({
    extended: true
}));
App.use(Cors());

App.use(Swaggerize({
    api: Path.resolve('./config/swagger.yaml'),
    docspath: '/docs',
    handlers: Path.resolve('./handlers')
}));

App.use('/ui', SwaggerUi({
    docs: '/docs'
}));

App.use('/', Express.static(__dirname + '/static'));

io.on('connection', socketManager.onConnection);

// Start the service that adds and removes random data
changeService.start();

Server.listen(8000, '0.0.0.0', function () {
    var port = this.address().port;
    require('dns').lookup(require('os').hostname(), function (err, addr, fam) {
        App.swagger.api.host = addr + ':' + port;
        /* eslint-disable no-console */
        console.log('App running on %s', App.swagger.api.host);
        /* eslint-disable no-console */
    });
});
