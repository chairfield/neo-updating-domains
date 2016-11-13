
$(function() {
    var width = $(window).width();
    var height = $(window).height() - 100;
    var force = d3.layout.force().charge(-10).linkDistance(100).size([width, height]);

    var container = d3.select("#graph");
    var svg = container.append("svg")
        .attr("width", "100%").attr("height", "90%")
        .attr("pointer-events", "all");

    // Background
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "pink");

    window.client = new SwaggerClient({
        url: "/docs",
        success: function() {
            $("#queryBtn").click(function() {
                var domain = $("#domainInput").val();
                client.query.queryByDomain(
                    { domain: domain, depth: 1 },
                    { responseContentType: 'application/json' },
                    function(res) {
                        updateGraph(res.obj);
                    });
            });
        }
    });

    function updateGraph(data) {
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
});
