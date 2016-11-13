'use strict';
var _ = require('lodash');

module.exports = {
    transformResponse: function(records) {
        var nodes = [];
        var links = [];

        var pushNode = function(record) {
            // TODO: Make this not O(N^2)
            if (!_.find(nodes, function(n) { return n.domain === record.properties.domain; })) {
                nodes.push({
                    domain: record.properties.domain,
                    ip: record.properties.ip,
                    id: record.identity.low
                })
            }
        };

        _.each(records, function(record) {
            if (record[1]) {
                pushNode(record[1]);
            }
            if (record[2]) {
                pushNode(record[2]);
            }
            if (record[0] && record[0].length > 0) {
                // TODO: Make this not O(N^2)
                links.push({
                    source: _.findIndex(nodes, function(n) { return n.id === record[0][0].start.low; }),
                    target: _.findIndex(nodes, function(n) { return n.id === record[0][0].end.low; })
                });
            }
        });

        return {
            nodes: nodes,
            links: links
        }
    }
};
