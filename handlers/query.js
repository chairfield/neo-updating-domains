'use strict';
var dataProvider = require('../data/query.js');
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
    get: function queryByDomain(req, res, next) {
        /**
         * Get the data for response 200
         * TODO: Currently, for response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['get']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data[0]['properties']);
        });
    }
};
