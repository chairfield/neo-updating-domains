'use strict';
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost");
var util = require('util');
var responseTransformer = require('./responseTransformer.js');

module.exports = {
    queryByDomain: function(domain, depth, callback) {

        // START n=node(212186) OPTIONAL MATCH (n)-[r*1..3]-(m) RETURN r, n, m;
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
                onNext: function(record) {
                    records.push(record._fields);
                },
                onCompleted: function() {
                    console.log("On complete: Closing session...");
                    session.close();
                    callback(null, responseTransformer.transformResponse(records));
                },
                onError: function(error) {
                    console.log("On error: ", error);
                    session.close();
                    callback(error, null);
                }
            });
    }
};