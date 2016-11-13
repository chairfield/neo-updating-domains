'use strict';
var neo4j = require('./neo4j.js');
var socketManager = require('../sockets/socketManager.js');
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
    // TODO: Why do I even have this?
    get: {
        200: function (req, res, callback) {
            var domain = req.query.domain;
            var depth = req.query.depth;
            var clientId = req.query.clientId;
            
            neo4j.queryByDomain(domain, depth, function(err, data) {
                if (err) {
                    callback(Mockgen().responses({
                        path: '/query',
                        operation: 'get',
                        response: 'default'
                    }), null);
                } else {
                    socketManager.onQuery(domain, depth, clientId, data);
                    callback(null, data);
                }
            });
        },
        // TODO: Use or lose
        default: function (req, res, callback) {
            Mockgen().responses({
                path: '/query',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
