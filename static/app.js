
$(function() {
    renderGraph();
    //search();

    /*$("#search").submit(e => {
        e.preventDefault();
    search();*/
});

function getGraph() {
    return {
        "nodes": [
            {
                "name": "node 1",
                "artist": "artist name 1",
                "id": "unique_id_1",
                "playcount": 123
            },
            {
                "name": "node 2",
                "artist": "artist name 2",
                "id": "unique_id_2",
                "playcount": 234
            }
        ],
        "links": [
            {
                "source": 0,
                "target": 1
            }
        ]
    };
}

function renderGraph() {
    var width = 800, height = 800;
    var force = d3.layout.force().charge(-200).linkDistance(30).size([width, height]);

    var svg = d3.select("#graph").append("svg")
        .attr("width", "100%").attr("height", "100%")
        .attr("pointer-events", "all");

    // Background
    svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "pink");

    var graph = getGraph();
    force.nodes(graph.nodes).links(graph.links).start();

    var link = svg.selectAll(".link")
        .data(graph.links).enter()
        .append("line").attr("class", "link");

    var node = svg.selectAll(".node")
        .data(graph.nodes).enter()
        .append("circle")
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