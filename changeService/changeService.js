'use strict';
var shortid = require('shortid');
var neo4j = require('../data/neo4j.js');
var socketManager = require('../sockets/socketManager.js');

// TODO: deal with errors
module.exports = {
    changeSomething: function() {
        var random = Math.random();
        if (random < .15) {
            console.time("add node");
            neo4j.createNode(randomDomain(), randomIp(), function() {
                console.timeEnd("add node");
            });
        } else if (random < .25) {
            console.time("rm node");
            console.time("node count");
            neo4j.getNodeCount(function(err, count) {
                console.timeEnd("node count");
                var n = Math.round(Math.random()*count);
                console.log('count:', count);
                neo4j.getNthNode(n, function(err, node) {
                    // TODO: Delete by id faster?
                    neo4j.deleteNodeByDomain(node.properties.domain, function(err, result) {
                        console.timeEnd("rm node");
                        if (!err && result) {
                            socketManager.onChangeData([ node.identity.low ]);
                        }
                    });
                });
            });
        } else {
            console.time("add link");
            neo4j.getNodeCount(function(err, count) {
                var n1 = Math.round(Math.random()*count);
                var n2 = Math.round(Math.random()*count);
                if (n1 !== n2) {
                    neo4j.getNthNode(n1, function(err, node1) {
                        neo4j.getNthNode(n2, function(err, node2) {
                            var id1 = node1.identity.low;
                            var id2 = node2.identity.low;
                            neo4j.linkNodes(id1, id2, function(err, result) {
                                console.timeEnd("add link");
                                if (!err && result) {
                                    socketManager.onChangeData([id1, id2]);
                                }
                            });
                        });
                    });
                }
            });
        }
    }
};

function randomDomain() {
    return shortid.generate() + '.' + shortid.generate();
}

function randomByte() {
    return Math.round(Math.random()*256);
}

function randomIp() {
    return randomByte() +'.' +
           randomByte() +'.' +
           randomByte() +'.' +
           randomByte();
}