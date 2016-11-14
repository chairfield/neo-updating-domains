'use strict';
var fs = require('fs');
console.time("read 1m domains");
var domains = fs.readFileSync('./top-1m.csv').toString().trim().split("\n");
console.timeEnd("read 1m domains");
var neo4j = require('../data/neo4j.js');
var socketManager = require('../sockets/socketManager.js');

var nodeCount = -1;

module.exports = {
    start: function() {
        var nodeCountInterval = setInterval(function () {
            neo4j.getNodeCount(function(err, count) {
                if (!err) {
                    clearInterval(nodeCountInterval);

                    nodeCount = count;
                    setInterval(function () {
                        changeSomething();
                    }, 200);
                }
            });
        }, 100);
    }
};

// TODO: deal with errors
function changeSomething() {
    var random = Math.random();
    if (nodeCount < 5000 || random < .20) {
        console.time("add node");
        var n = Math.round(Math.random() * 1000000);
        neo4j.createNode(domains[n], randomIp(), function(err, result) {
            console.timeEnd("add node");
            if (!err && result) {
                nodeCount++;
            }
        });
    } else if (random < .45) {
        console.time("rm node");
        var n = Math.round(Math.random() * nodeCount);
        console.log('count:', nodeCount);
        neo4j.getNthNode(n, function(err, node) {
            // TODO: Delete by id faster?
            neo4j.deleteNodeByDomain(node.properties.domain, function(err, result) {
                console.timeEnd("rm node");
                if (!err && result) {
                    nodeCount--;
                    socketManager.onChangeData([ node.identity.low ]);
                }
            });
        });
    } else {
        console.time("add link");
        var n1 = Math.round(Math.random() * nodeCount);
        var n2 = Math.round(Math.random() * nodeCount);
        if (n1 !== n2) {
            neo4j.getNthNode(n1, function(err, node1) {
                neo4j.getNthNode(n2, function(err, node2) {
                    if (node1 && node2) {
                        var id1 = node1.identity.low;
                        var id2 = node2.identity.low;
                        neo4j.linkNodes(id1, id2, function(err, result) {
                            console.timeEnd("add link");
                            if (!err && result) {
                                socketManager.onChangeData([id1, id2]);
                            }
                        });
                    }
                });
            });
        }
    }
}

function randomByte() {
    return Math.round(Math.random() * 256);
}

function randomIp() {
    return randomByte() +'.' +
           randomByte() +'.' +
           randomByte() +'.' +
           randomByte();
}