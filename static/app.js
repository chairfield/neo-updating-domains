
$(function() {
    var updateGraphFunc = initializeGraph();

    // Possible events: connect, connect_error, connect_timeout,
    //   reconnect, reconnect_attempt, reconnecting, reconnect_error, reconnect_failed
    var socket = io();
    socket.on('connect', function() {
        // TODO: Show something when the socket is connected
        window.client = new SwaggerClient({
            url: "/docs",
            success: function() {
                getDomains();

                $("#queryBtn").click(function() { onQuery(socket.id); });
                $("#getDomainsBtn").click(function() { getDomains(); });
            }
        });
    });
    socket.on('graphUpdated', function(updatedGraph) {
        console.log("new data from socket.io:", updatedGraph);
        updateGraphFunc(updatedGraph);
    });

    function onQuery(clientId) {
        var domain = $("#domainInput").val();
        var depth = $("#depthInput").val();
        // TODO: Input validation (e.g., empty domain or depth)
        client.query.queryByDomain(
            { domain: domain, depth: depth, clientId: clientId },
            { responseContentType: 'application/json' },
            function(res) { updateGraphFunc(res.obj); });
    }

    function getDomains() {
        client.domains.getTenDomains(
            null,
            { responseContentType: 'application/json' },
            function(res) { displayPossibleDomains(res.obj); });
    }
});

function displayPossibleDomains(domains) {
    $("#possibleDomains").text(domains.join(", "));
    $("#domainInput").val(domains[0]);
}

var oldData;

function initializeGraph() {
    var width = $(window).width();
    var height = $(window).height() - 130;
    var force = d3.layout.force().charge(-300).linkDistance(100).size([width, height]);

    var svg = d3.select("#graph").append("svg")
        .attr("width", "100%").attr("height", "85%")
        .attr("pointer-events", "all");

    // Background
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "pink");

    return function(data) {
        if (oldData && _.isEqual(oldData, data)) {
            console.error("data didn't change");
        }
        oldData = data;

        if (data.nodes.length > 0) {
            // Fix the root node in the middle
            data.nodes[0].fixed = true;
            data.nodes[0].x = width / 2;
            data.nodes[0].y = height / 2;
        }

        force.nodes(data.nodes).links(data.links).start();

        svg.selectAll(".link")
            .data([])
            .exit().remove();

        svg.selectAll(".node")
            .data([])
            .exit().remove();

        var link = svg.selectAll(".link")
            .data(data.links)
            .enter().append("line")
            .attr("class", "link");

        var node = svg.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 10)
            .call(force.drag);

        force.on("tick", function() {
            link.attr("x1", function(d) {
                return d.source.x;
            }).attr("y1", function(d) {
                return d.source.y;
            }).attr("x2", function(d) {
                return d.target.x;
            }).attr("y2", function(d) {
                return d.target.y;
            });

            node.attr("cx", function(d) {
                return d.x;
            }).attr("cy", function(d) {
                return d.y;
            });
        });
    }
}
