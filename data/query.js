'use strict';
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost");
// TODO: Remove this once I'm returning actual errors
var Mockgen = require('./mockgen.js');
var util = require('util');
/**
 * Operations on /query
 */
module.exports = {
    /**
     * summary: Query graph by domain
     * parameters: domain, depth
     * produces: GraphResponse, Error
     * responses: 200, default
     * operationId: queryByDomain
     */
    get: {
        200: function (req, res, callback) {
            var session = driver.session();

            var query = util.format(
                "MATCH (n{domain:\"%s\") OPTIONAL MATCH (n)-[r*1..%d]-(m) RETURN r, n, m;",
                req.query.domain,
                req.query.depth
            );

            // START n=node(212186) OPTIONAL MATCH (n)-[r*1..3]-(m) RETURN r, n, m;
            // "MATCH (n{domain:\"%s\"}) OPTIONAL MATCH (n)-[r]-() RETURN r, n;");
            session
                .run(query)
                .subscribe({
                    onNext: function(record) {
                        console.log(record._fields);
                        callback(null, record._fields);
                    },
                    onCompleted: function() {
                        console.log("On complete: Closing session");
                        session.close();
                    },
                    onError: function(error) {
                        console.log(error);
                        session.close();
                        // TODO: Actual error instead of mock
                        callback(Mockgen().responses({
                            path: '/query',
                            operation: 'get',
                            response: 'default'
                        }), null);
                    }
                });
        },
        default: function (req, res, callback) {
            Mockgen().responses({
                path: '/query',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
