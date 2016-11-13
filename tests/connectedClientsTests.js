'use strict';
var test = require('tape');
var sut = require('../sockets/connectedClients.js');

test('sockets/connectedClients.js', function (t) {
    t.test('test onClientConnection', function(t) {
        // Arrange
        var clientId = "123";

        // Act
        sut.onClientConnection(clientId);

        // Assert
        t.deepEqual(sut.connectedClients, [ clientId ], "not deeply equal");
        t.end();
    });
    t.test('test onClientDisconnection', function(t) {
        // Arrange
        var clientId = "123";
        sut.connectedClients.push(clientId);

        // Act
        sut.onClientDisconnection(clientId);

        // Assert
        t.deepEqual(sut.connectedClients, [], "not deeply equal");
        t.end();
    });
    t.test('test contains false', function(t) {
        // Arrange
        var clientId = "123";

        // Act
        var response = sut.contains(clientId);

        // Assert
        t.equals(response, false);
        t.end();
    });
    t.test('test contains true', function(t) {
        // Arrange
        var clientId = "123";
        sut.onClientConnection("789");
        sut.onClientConnection(clientId);

        // Act
        var response = sut.contains(clientId);

        // Assert
        t.equals(response, true);
        t.end();
    });
});
