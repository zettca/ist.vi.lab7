
var dataset, full_dataset;
var selectedBar, selectedCircle;

var dispatch = d3.dispatch("movieEnter");

dispatch.on("movieEnter", (movie) => {
  console.log("TITLE: " + movie.title);

  if (selectedBar != null) {
    selectedBar.attr("fill", "purple");
    selectedCircle.attr("fill", "purple");
  }

  selectedBar = d3.select(`rect[title="${movie.title}"]`);
  selectedCircle = d3.select(`circle[title="${movie.title}"]`);

  selectedBar.attr("fill", "red");
  selectedCircle.attr("fill", "red");
});

d3.json("oscar_winners.json").then(function (data) {
  full_dataset = data;
  dataset = full_dataset.slice(0, 35);

  gen_bars();
  gen_scatterplot();
});



function genvis() {

  var w = 800;
  var h = 400;
  var svg = d3.select("#the_chart");

  svg = svg.append("svg");
  svg = svg.attr("width", w);
  svg = svg.attr("height", h);

  var padding = 30;


  var hscale = d3.scaleLinear()
    .domain([10, 0])
    .range([padding, h - padding]);


  var xscale = d3.scaleLinear()
    .domain([0, dataset.length])
    .range([padding, w - padding]);

  var yaxis = d3.axisLeft()
    .scale(hscale);

  svg.append("g")
    .attr("transform", "translate(30,0)")
    .attr("class", "y axis")
    .call(yaxis);

  var bar_w = 15;
  var xaxis = d3.axisBottom()
    .scale(d3.scaleLinear()
      .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
      .range([padding + bar_w / 2, w - padding - bar_w / 2]))
    .tickFormat(d3.format("d"))
    .ticks(dataset.length / 4);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xaxis);

  svg.selectAll("rect").append("title")
    .data(dataset)
    .text(function (d) { return d.title; });

  d3.selectAll("#old")
    .on("click", function () {
      dataset = full_dataset.slice(35, 70);
      bar_w = Math.floor((w - padding * 2) / dataset.length) - 1;

      svg.selectAll("rect")
        .data(dataset)
        .transition()
        .duration(1000)

        .attr("height", function (d) {
          return h - padding - hscale(d.rating);
        })
        .attr("fill", "red")
        .attr("y", function (d) {
          return hscale(d.rating);
        })
        .select("title")
        .text(function (d) { return d.title; });
    })


  svg.selectAll("rect")
    .data(dataset)
    .enter().append("rect")
    .attr("width", Math.floor((w - padding * 2) / dataset.length) - 1)
    .attr("height", function (d) {
      return h - padding - hscale(d.rating);
    })

    .attr("fill", "purple")
    .attr("x", function (d, i) {
      return xscale(i);
    })
    .attr("y", function (d) {
      return hscale(d.rating);
    });

  xaxis.scale(d3.scaleLinear()
    .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
    .range([padding + bar_w / 2, w - padding - bar_w / 2]));

  d3.select(".x.axis")
    .call(xaxis);

}

function gen_bars() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);


  var padding = 30;
  var bar_w = 15;

  var hscale = d3.scaleLinear()
    .domain([10, 0])
    .range([padding, h - padding]);

  var xscale = d3.scaleLinear()
    .domain([0, dataset.length])
    .range([padding, w - padding]);


  var yaxis = d3.axisLeft()
    .scale(hscale);

  var xaxis = d3.axisBottom()
    .scale(d3.scaleLinear()
      .domain([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year])
      .range([padding + bar_w / 2, w - padding - bar_w / 2]))
    .tickFormat(d3.format("d"))
    .ticks(dataset.length / 4);
  //.ticks(20);

  svg.append("g")
    .attr("transform", "translate(30,0)")
    .attr("class", "y axis")
    .call(yaxis);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xaxis);


  svg.selectAll("rect")
    .data(dataset)
    .enter().append("rect")
    .attr("width", Math.floor((w - padding * 2) / dataset.length) - 1)
    .attr("height", function (d) {
      return h - padding - hscale(d.rating);
    })
    .attr("fill", "purple")
    .attr("x", function (d, i) {
      return xscale(i);
    })
    .attr("y", function (d) {
      return hscale(d.rating);
    })
    .attr("title", function (d) { return d.title; })

    .on("mouseover", (d) => {
      dispatch.call("movieEnter", d, d);
    });

}

function gen_scatterplot() {
  var w = 600;
  var h = 300;

  var svg = d3.select("#the_chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("fill", "blue");


  var padding = 30;
  var bar_w = 15;
  var r = 5;

  var hscale = d3.scaleLinear()
    .domain([10, 0])
    .range([padding, h - padding]);

  var xscale = d3.scaleLinear()
    .domain([0.5, d3.max(dataset, function (d) {
      return d.budget;
    }) / 1000000])
    .range([padding, w - padding]);

  var yaxis = d3.axisLeft()
    .scale(hscale);

  var xaxis = d3.axisBottom()
    .scale(xscale)
    .ticks(dataset.length / 2);

  var cscale = d3.scaleLinear()
    .domain([d3.min(dataset, function (d) { return d.year; }),
    d3.max(dataset, function (d) { return d.year; })])
    .range(["red", "blue"]);


  gY = svg.append("g")
    .attr("transform", "translate(30,0)")
    .attr("class", "y axis")
    .call(yaxis);


  gX = svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xaxis);

  svg.selectAll("circle")
    .data(dataset)
    .enter().append("circle")
    .attr("r", r)
    .attr("fill", "purple")
    .attr("cx", function (d, i) {
      if (d.budget_adj == 0) { return padding; }
      return xscale(d.budget_adj / 1000000);
    })
    .attr("cy", function (d) {
      return hscale(d.rating);
    })
    .attr("title", function (d) { return d.title; })

    .on("mouseover", (d) => {
      dispatch.call("movieEnter", d, d);
    });






}
