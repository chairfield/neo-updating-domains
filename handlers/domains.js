'use strict';
var neo4j = require('../data/neo4j.js');

/**
 * Operations on /domains
 */
module.exports = {
    /**
     * summary: Get 10 random domains from graph
     * produces: Domains, Error
     * responses: 200, default
     * operationId: getTenDomains
     */
    get: function getTenDomains(req, res, next) {
        neo4j.queryForDomains(function(err, data) {
            if (err) {
                next(err[0].message);
                return;
            }
            res.status(200).send(data);
        });
    }
};
