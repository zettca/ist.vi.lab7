const pad = 30;
const width = 1000;
const height = 300;

let bar_w = 15;
let ds, full_dataset;

d3.selectAll('#old')
  .on('click', () => {
  });

d3.json('oscar_winners.json').then((data) => {
  full_dataset = data;
  ds = full_dataset.slice(0, Math.floor(full_dataset.length / 2));
  generateVis();
});

const barChart = d3.select('#the_chart')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

function scaleLin(domain, range) {
  return d3.scaleLinear().domain(domain).range(range);
}

function generateVis() {
  const hScale = scaleLin([10, 0], [pad, height - pad]);
  const xScale = scaleLin([0, ds.length], [pad, width - pad]);

  // GRAPH 1

  const yAxis = d3.axisLeft().scale(hScale);
  const xAxis = d3.axisBottom()
    .scale(scaleLin([ds[0].oscar_year, ds[ds.length - 1].oscar_year], [pad + bar_w / 2, width - pad - bar_w / 2]))
    .tickFormat(d3.format('d')).ticks(ds.length / 2);

  barChart.append('g')
    .attr('transform', `translate(${pad},0)`)
    .attr('class', 'y axis')
    .call(yAxis);

  barChart.append('g')
    .attr('transform', `translate(0, ${(height - pad)})`)
    .attr('class', 'x axis')
    .call(xAxis);

  barChart.selectAll('rect').data(ds)
    .enter().append('rect')
    .attr('width', Math.floor((width - pad * 2) / ds.length) - 1)
    .attr('height', (d) => height - pad - hScale(d.rating))
    .attr('fill', (d, i) => `rgb(192,${(3 * i) % 192},192)`)
    .attr('x', (d, i) => xScale(i + 0.5))
    .attr('y', (d) => hScale(d.rating));

  barChart.selectAll('rect').append('title').data(ds)
    .text(d => d.title);

  d3.selectAll('#old')
    .on('click', () => {
      ds = full_dataset.slice(Math.floor(full_dataset.length / 2));

      barChart.selectAll('rect').data(ds)
        .transition().duration(1000)
        .attr('height', (d) => height - pad - hScale(d.rating))
        .attr('fill', (d, i) => `rgb(${100 + (3 * i) % 255},0,0)`)
        .attr('y', (d) => hScale(d.rating))
        .select('title').text(d => d.title);

      const bw = (Math.floor((width - pad * 2) / ds.length) - 1) / 2;
      xAxis.scale(scaleLin([ds[0].oscar_year, ds[ds.length - 1].oscar_year], [pad + bw, width - pad - bw]));
      d3.select('.x.axis').call(xAxis);
    });

  d3.selectAll('#new')
    .on('click', () => {
      ds = full_dataset.slice(0, Math.floor(full_dataset.length / 2));
      bar_w = Math.floor((width - pad * 2) / ds.length) - 1;

      barChart.selectAll('rect').data(ds)
        .transition().duration(1000)
        .attr('height', (d) => height - pad - hScale(d.rating))
        .attr('fill', (d, i) => `rgb(192,${(3 * i) % 192},192)`)
        .attr('y', (d) => hScale(d.rating))
        .select('title').text(d => d.title);

      const bw = (Math.floor((width - pad * 2) / ds.length) - 1) / 2;
      xAxis.scale(scaleLin([ds[0].oscar_year, ds[ds.length - 1].oscar_year], [pad + bw, width - pad - bw]));
      d3.select('.x.axis').call(xAxis);
    });

  // GRAPH 2

  const sc = 1000000;

  const xScaleLin = d3.scaleLinear()
    .domain([0, d3.max(full_dataset, (d) => d.budget) / sc])
    .range([pad, width - pad]);

  const xScaleLog = d3.scaleLog()
    .domain([0.5, d3.max(full_dataset, (d) => d.budget) / sc])
    .range([pad, width - pad]);

  const cScale = d3.scaleLinear()
    .domain([d3.min(full_dataset, d => d.year), d3.max(full_dataset, d => d.year)])
    .range(['#FA0', '#F00']);

  const scatterPlot = d3.select('#second_chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  scatterPlot.selectAll('circle').data(full_dataset)
    .enter().append('circle')
    .attr('r', 5)
    .attr('fill', (d) => cScale(d.year))
    .attr('cx', (d) => (d.budget === 0) ? pad : xScaleLog(d.budget / sc))
    .attr('cy', (d) => hScale(d.rating))
    .append('title').text(d => d.title);

  scatterPlot.append('g')
    .attr('transform', `translate(${pad},0)`)
    .attr('class', 'y axis')
    .call(yAxis);

  scatterPlot.append('g')
    .attr('transform', `translate(0, ${(height - pad)})`)
    .attr('class', 'x axis')
    .call(xAxis);

}
