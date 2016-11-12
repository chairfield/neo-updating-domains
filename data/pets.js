'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /pets
 */
module.exports = {
    /**
     * summary: List all pets
     * description: 
     * parameters: limit
     * produces: 
     * responses: 200, default
     * operationId: listPets
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/pets',
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
                path: '/pets',
                operation: 'get',
                response: 'default'
            }, callback);
        }
    },
    /**
     * summary: Create a pet
     * description: 
     * parameters: 
     * produces: 
     * responses: 201, default
     * operationId: createPets
     */
    post: {
        201: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/pets',
                operation: 'post',
                response: '201'
            }, callback);
        },
        default: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/pets',
                operation: 'post',
                response: 'default'
            }, callback);
        }
    }
};
