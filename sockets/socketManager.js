'use strict';
var _ = require('lodash');
// TODO: Only when multiple clients are possible
//var connectedClients = require('./connectedClients.js');
// TODO: Spaghetti
var neo4j = require('../data/neo4j.js');

var clientSocket;
var clientData;

module.exports = {
    onConnection: function(socket) {
        clientSocket = socket;
        socket.on('disconnect', function() {
            //connectedClients.onClientDisconnection(clientId);
            clientSocket = undefined;
        });
    },
    onQuery: function(domain, depth, clientId, graphData) {
        //if (!connectedClients.contains(clientId)) {
        if (!clientSocket) {
            throw "Client must be connected during query";
        }

        // connectedClients.setData(clientId, {
        //     domain: domain,
        //     depth: depth,
        //     nodeCache: transform(graphData)
        // });
        clientData = {
            domain: domain,
            depth: depth,
            nodeIds: _.map(graphData.nodes, function(n) {
                return n.id;
            })
        };
    },
    onChangeData: function(changedNodes) {
        if (clientSocket && changedNodes && clientData) {
            if (changeDataAffectsClient(changedNodes)) {
                console.log("client affected", clientData.nodeIds, changedNodes);
                neo4j.queryByDomain(clientData.domain, clientData.depth, function(err, data) {
                    if (err) {
                        console.log("Neo4j Error:", err)
                    } else {
                        clientSocket.emit('graphUpdated', data);
                    }
                })
            }
        }
    }
};

function changeDataAffectsClient(changedNodes) {
    return _.intersection(clientData.nodeIds, changedNodes).length > 0;
}
