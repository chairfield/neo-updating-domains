'use strict';
var test = require('tape');
var sut = require('../data/responseTransformer.js');

test('data/transformResponse.js', function (t) {
    t.test('test empty', function(t) {
        var records = [];
        var expected = {
            nodes: [],
            links: []
        };

        // Act
        var actual = sut.transformResponse(records);

        // Assert
        t.deepEqual(actual, expected, "not deeply equal");
        t.end();
    });
    t.test('test single node', function(t) {
        // Arrange
        var node = genNode(212239, "google.com", "1.1.1.1", "1");
        var records = [
            genRecord(null, node, null)
        ];
        var expected = {
            nodes: [ d3NodeFromNeoNode(node) ],
            links: []
        };

        // Act
        var actual = sut.transformResponse(records);

        // Assert
        t.deepEqual(actual, expected, "not deeply equal");
        t.end();
    });
    t.test('test triangle (3 nodes, all linked)', function(t) {
        // Arrange
        var nodeA = genNode(10, "a.com", "1.1.1.1");
        var nodeB = genNode(11, "b.com", "1.1.1.2");
        var nodeC = genNode(12, "c.com", "1.1.1.3");
        var records = [
            genRecord([ genLink(10, 11) ], nodeA, nodeB),
            genRecord([ genLink(11, 12) ], nodeB, nodeC),
            genRecord([ genLink(10, 12) ], nodeA, nodeC)
        ];
        var expected = {
            nodes: [
                d3NodeFromNeoNode(nodeA),
                d3NodeFromNeoNode(nodeB),
                d3NodeFromNeoNode(nodeC)
            ],
            links: [
                genD3Link(0, 1),
                genD3Link(1, 2),
                genD3Link(0, 2)
            ]
        };

        // Act
        var actual = sut.transformResponse(records);

        // Assert
        t.deepEqual(actual, expected, "not deeply equal");
        t.end();
    });
    t.test('test complex (depth=2)', function(t) {
        // Arrange
        var nodeA = genNode(39, "a.com", "1.1.1.1");
        var nodeB = genNode(43, "b.com", "1.1.1.2");
        var nodeC = genNode(40, "c.com", "1.1.1.3");
        var nodeD = genNode(41, "d.com", "1.1.1.4");
        var nodeE = genNode(45, "e.com", "1.1.1.5");
        var nodeF = genNode(47, "f.com", "1.1.1.6");
        var nodeG = genNode(44, "g.com", "1.1.1.7");
        var nodeH = genNode(48, "h.com", "1.1.1.8");
        var records = [
            genRecord([ genLink(39, 43) ], nodeA, nodeB),
            genRecord([ genLink(39, 43), genLink(40, 43) ], nodeA, nodeC),
            genRecord([ genLink(39, 40) ], nodeA, nodeC),
            genRecord([ genLink(39, 40), genLink(43, 40) ], nodeA, nodeB),
            genRecord([ genLink(39, 40), genLink(40, 41) ], nodeA, nodeD),
            genRecord([ genLink(39, 40), genLink(45, 40) ], nodeA, nodeE),
            genRecord([ genLink(47, 39) ], nodeA, nodeF),
            genRecord([ genLink(47, 39), genLink(44, 47) ], nodeA, nodeG),
            genRecord([ genLink(47, 39), genLink(47, 48) ], nodeA, nodeH)
        ];
        var expected = {
            nodes: [
                d3NodeFromNeoNode(nodeA),
                d3NodeFromNeoNode(nodeB),
                d3NodeFromNeoNode(nodeC),
                d3NodeFromNeoNode(nodeD),
                d3NodeFromNeoNode(nodeE),
                d3NodeFromNeoNode(nodeF),
                d3NodeFromNeoNode(nodeG),
                d3NodeFromNeoNode(nodeH)
            ],
            links: [
                genD3Link(0, 1),
                genD3Link(2, 1),
                genD3Link(0, 2),
                genD3Link(2, 3),
                genD3Link(4, 2),
                genD3Link(5, 0),
                genD3Link(6, 5),
                genD3Link(5, 7)
            ]
        };

        // Act
        var actual = sut.transformResponse(records);

        // Assert
        t.deepEqual(actual, expected, "not deeply equal");
        t.end();
    });
});

function genRecord(link, lhnode, rhnode) {
    return [
        link,
        lhnode,
        rhnode
    ];
}

function genLink(start, end) {
    return {
        start: {
            high: 0,
            low: start
        },
        end: {
            high: 0,
            low: end
        },
        identity: {
            high: 0,
            low: 1
        },
        properties: {},
        type: "LinksTo"
    };
}

function genNode(id, domain, ip) {
    return {
        identity: {
            high: 0,
            low: id
        },
        labels: [
            "Address"
        ],
        properties: {
            domain: domain,
            id: "-1", // TODO: Delete id
            ip: ip
        }
    }
}

function d3NodeFromNeoNode(neoNode) {
    return {
        domain: neoNode.properties.domain,
        ip: neoNode.properties.ip,
        id: neoNode.identity.low
    }
}

function genD3Link(source, target) {
    return {
        source: source,
        target: target
    }
}