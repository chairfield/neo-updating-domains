'use strict';
var Test = require('tape');
var Express = require('express');
var BodyParser = require('body-parser');
var Swaggerize = require('swaggerize-express');
var Path = require('path');
var Request = require('supertest');
var Mockgen = require('../data/mockgen.js');
var Parser = require('swagger-parser');
var Validator = require('is-my-json-valid');

/**
 * Test for /query
 */
Test('/query', function (t) {
    var apiPath = Path.resolve(__dirname, '../config/swagger.yaml');
    var App = Express();
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({
        extended: true
    }));
    App.use(Swaggerize({
        api: apiPath,
        handlers: Path.resolve(__dirname, '../handlers')
    }));
    Parser.validate(apiPath, function (err, api) {
        t.error(err, 'No parse error');
        t.ok(api, 'Valid swagger api');
        /**
         * summary: Query graph by domain
         * parameters: domain, depth
         * produces: GraphResponse, Error
         * responses: 200, default
         * operationId: queryByDomain
         */
        t.test('test queryByDomain get operation', function(t) {
            Mockgen().requests({
                path: '/query',
                operation: 'get'
            }, function(err, mock) {
                t.error(err, 'No parse error');
                t.ok(mock, 'mock ok');
                t.ok(mock.request, 'mock.request ok');

                var request = Request(App).get(mock.request.path);
                request.end(function(err, res) {
                    t.error(err, 'No error on response');
                    t.ok(res.statusCode === 200, 'Ok response status');

                    var response = res.body;
                    if (Object.keys(response).length <= 0) {
                        response = res.text;
                    }

                    var validate = Validator(api.paths['/query']['get']['responses']['200']['schema']);
                    t.ok(validate(response), 'Response is valid json');
                    t.error(validate.errors, 'No validation errors');
                    t.end();
                });
            });
        });
    });
});
