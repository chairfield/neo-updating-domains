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

setInterval(function() {
    changeService.changeSomething();
}, 100);

Server.listen(8000, '0.0.0.0', function () {
    App.swagger.api.host = this.address().address + ':' + this.address().port;
    /* eslint-disable no-console */
    console.log('App running on %s', App.swagger.api.host);
    /* eslint-disable no-console */
});
