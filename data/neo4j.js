'use strict';
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://" + neoAddress());
var util = require('util');
var responseTransformer = require('./responseTransformer.js');

function neoAddress() {
    return process.env.NEO_ADDRESS ? process.env.NEO_ADDRESS : "localhost";
}

// TODO: Are all methods in use?
module.exports = {
    queryByDomain: function(domain, depth, callback) {

        // TODO: START n=node(212186) OPTIONAL MATCH (n)-[r*1..3]-(m) RETURN r, n, m;
        // "MATCH (n{domain:\"%s\"}) OPTIONAL MATCH (n)-[r]-() RETURN r, n;");
        var query = util.format(
            "MATCH (n{domain:\"%s\"}) OPTIONAL MATCH (n)-[r*1..%d]-(m) RETURN r, n, m;",
            domain,
            depth
        );

        var records = [];
        var session = driver.session();
        session
            .run(query)
            .subscribe({
                onNext: function(record) { records.push(record._fields); },
                onCompleted: function() {
                    session.close();
                    callback(null, responseTransformer.transformResponse(records));
                },
                onError: function(error) { onError(session, error, callback); }
            });
    },
    createNode: function(domain, ip, callback) {
        var session = driver.session();
        session
            .run("CREATE (:Address {domain:{domain}, ip:{ip}});", {domain: domain, ip: ip})
            .subscribe({
                onCompleted: function() {
                    session.close();
                    callback(null, true);
                },
                onError: function(error) { onError(session, error, callback); }
            });
    },
    getNodeCount: function(callback) {
        var session = driver.session();
        session
            .run("START n=node(*) RETURN COUNT(*);")
            .subscribe({
                onNext: function(record) { callback(null, record._fields[0].low); },
                onCompleted: function()  { session.close(); },
                onError: function(error) { onError(session, error, callback); }
            });
    },
    getNthNode: function(n, callback) {
        var session = driver.session();
        session
        // TODO: I actually don't care about the relationships:
            // "START n=node(*) OPTIONAL MATCH (n)-[r*1..1]-(m) RETURN r, n SKIP {n} LIMIT 1;"
            .run("START n=node(*) RETURN n SKIP {n} LIMIT 1;", {n: n})
            .subscribe({
                onNext: function(record) { callback(null, record._fields[0]); },
                onCompleted: function()  { session.close(); },
                onError: function(error) { onError(session, error, callback); }
            });
    },
    deleteNodeByDomain: function(domain, callback) {
        var session = driver.session();
        session
            .run("MATCH (n{domain:{domain}}) DETACH DELETE n;", {domain: domain})
            .subscribe({
                onCompleted: function() {
                    session.close();
                    callback(null, true);
                },
                onError: function(error) { onError(session, error, callback); }
            });
    },
    linkNodes: function(id1, id2, callback) {
        var session = driver.session();
        session
            .run("START a=node({id2}),b=node({id2}) MERGE (a)-[:LinksTo]->(b);", {id1: id1, id2: id2})
            .subscribe({
                onCompleted: function() {
                    session.close();
                    callback(null, true);
                },
                onError: function(error) { onError(session, error, callback); }
            });
    }
};

function onError(session, error, callback) {
    session.close();
    console.log("Neo4j error: ", error);
    callback(error, null);
}
