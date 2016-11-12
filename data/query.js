'use strict';
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
            Mockgen().responses({
                path: '/query',
                operation: 'get',
                response: '200'
            }, callback);
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
