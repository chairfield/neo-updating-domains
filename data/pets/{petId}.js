'use strict';
var Mockgen = require('../mockgen.js');
/**
 * Operations on /pets/{petId}
 */
module.exports = {
    /**
     * summary: Info for a specific pet
     * description: 
     * parameters: petId
     * produces: 
     * responses: 200, default
     * operationId: showPetById
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/pets/{petId}',
                operation: 'get',
                response: '200'
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/pets/{petId}',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    }
};
