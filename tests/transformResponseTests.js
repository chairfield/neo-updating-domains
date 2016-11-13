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
        var records = [
            genRecord(null, genNode(212239, "google.com", "1.1.1.1", "1"), null)
        ];
        var expected = {
            nodes: [
                {
                    domain: "google.com",
                    ip: "1.1.1.1",
                    id: 212239
                }
            ],
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
            genRecord(genLink(10, 11), nodeA, nodeB),
            genRecord(genLink(11, 12), nodeB, nodeC),
            genRecord(genLink(10, 12), nodeA, nodeC)
        ];
        var expected = {
            nodes: [
                {
                    domain: "a.com",
                    ip: "1.1.1.1",
                    id: 10
                },
                {
                    domain: "b.com",
                    ip: "1.1.1.2",
                    id: 11
                },
                {
                    domain: "c.com",
                    ip: "1.1.1.3",
                    id: 12
                }
            ],
            links: [
                {
                    "source": 0,
                    "target": 1
                },
                {
                    "source": 1,
                    "target": 2
                },
                {
                    "source": 0,
                    "target": 2
                }
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
    return [
        {
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
        }
    ];
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