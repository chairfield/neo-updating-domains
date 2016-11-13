'use strict';
var _ = require('lodash');

var connectedClients = [];

module.exports = {
    connectedClients: connectedClients,
    onClientConnection: function(clientId) {
        console.log('a user connected:', clientId);
        connectedClients.push(clientId);
    },
    onClientDisconnection: function(clientId) {
        console.log('a user disconnected:', clientId);
        _.remove(connectedClients, function(c) {
            return c === clientId;
        });
    },
    contains: function(clientId) {
        return _.find(connectedClients, function(c) {
            return c === clientId;
        }) === clientId;
    }
};
