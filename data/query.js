'use strict';
var neo4j = require('./neo4j.js');
// TODO: Remove this once I'm returning actual errors
var Mockgen = require('./mockgen.js');
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
            neo4j.queryByDomain(req.query.domain, req.query.depth, function(err, data) {
                if (err) {
                    callback(Mockgen().responses({
                        path: '/query',
                        operation: 'get',
                        response: 'default'
                    }), null);
                } else {
                    callback(null, data);
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
