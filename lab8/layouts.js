function treemap() {

  var width = 800,
    height = 600;

  var treemap = d3.treemap()
    .size([width, height])
    .padding(1);

  var format = d3.format(",d");

  var stratify = d3.stratify()
    .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var color = d3.scaleOrdinal()
    .range(d3.schemeCategory10
      .map(c => {
        c = d3.rgb(c);
        c.opacity = 0.7;
        return c;
      }));

  d3.csv("flare.csv").then(function (data) {
    var root = stratify(data)
      .sum(function (d) { return d.value; })
      .sort(function (a, b) { return b.height - a.height || b.value - a.value; });

    treemap(root);

    d3.select("body")
      .selectAll(".node")
      .data(root.leaves())
      .enter().append("div")
      .attr("class", "node")
      .attr("title", d => `${d.id}\n${format(d.value)}`)
      .style("left", d => `${d.x0}px`)
      .style("top", d => `${d.y0}px`)
      .style("width", d => `${d.x1 - d.x0}px`)
      .style("height", d => `${d.y1 - d.y0}px`)
      .style("background", d => {
        while (d.depth > 1) d = d.parent;
        return color(d.id);
      })
      .text(d => d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g).join("\n"))
      .append("div")
      .attr("class", "node-value")
      .text(d => format(d.value));
  });

  function type(d) {
    d.value = +d.value;
    return d;
  }
}

function pack() {
  var width = 800,
    height = 600;

  var svg = d3.select("svg"),
    width = width
  height = height

  var format = d3.format(",d");


  var stratify = d3.stratify()
    .parentId(function (d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var pack = d3.pack()
    .size([width - 2, height - 2])
    .padding(3);

  var color = d3.scaleSequential(d3.interpolateMagma).domain([-4, 4]);

  d3.csv("flare.csv").then(function (data) {

    var root = stratify(data)
      .sum(function (d) { return d.value; })
      .sort(function (a, b) { return b.value - a.value; });

    pack(root);

    var node = svg.select("g")
      .selectAll("g")
      .data(root.descendants())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("class", d => "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"))
      .each(d => { d.node = this });

    node.append("circle")
      .attr("id", d => "node-" + d.id)
      .attr("r", d => d.r)
      .style("fill", d => color(d.depth));

    var leaf = node.filter(d => !d.children);

    leaf.append("clipPath")
      .attr("id", d => "clip-" + d.id)
      .append("use")
      .attr("xlink:href", d => "#node-" + d.id)

    leaf.append("text")
      .attr("clip-path", d => `url(#clip-${d.id})`)
      .selectAll("tspan")
      .data(d => d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g))
      .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => 13 + (i - nodes.length / 2 - 0.5) * 10)
      .text(d => d);
  });


}
