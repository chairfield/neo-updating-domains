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
                });
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
                _.each(record[0], function(link) {
                    var startIndex = _.findIndex(nodes, function(n) { return n.id === link.start.low; });
                    var endIndex = _.findIndex(nodes, function(n) { return n.id === link.end.low; });
                    // TODO: Make this not horrible
                    if (!_.find(links, function(l) {
                            return (l.source === startIndex && l.target === endIndex) ||
                                   (l.source === endIndex && l.target === startIndex);
                        })) {
                        // TODO: Make this not O(N^2)
                        links.push({
                            source: startIndex,
                            target: endIndex
                        });
                    }
                });
            }
        });

        return {
            nodes: nodes,
            links: links
        }
    }
};
