let half, dataset, full_dataset;

d3.selectAll('#old')
  .on('click', () => {
  });

d3.json('oscar_winners.json').then((data) => {
  full_dataset = data;
  half = Math.floor(full_dataset.length / 2);
  dataset = data.slice(0, half);
  gen_vis();
});

function scaleLin(domain, range) {
  return d3.scaleLinear().domain(domain).range(range);
}

function gen_vis() {
  const pad = 30;
  const width = 1000;
  const height = 300;
  let bar_w = 15;

  // GRAPH 1

  const svg = d3.select('#the_chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const hScale = scaleLin([10, 0], [pad, height - pad]);
  const xScale = scaleLin([0, dataset.length], [pad, width - pad]);

  const yAxis = d3.axisLeft()
    .scale(hScale);
  const xAxis = d3.axisBottom()
    .scale(scaleLin([dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year], [pad + bar_w / 2, width - pad - bar_w / 2]))
    .tickFormat(d3.format('d'))
    .ticks(dataset.length / 4);

  svg.append('g')
    .attr('transform', `translate(${pad},0)`)
    .attr('class', 'y axis')
    .call(yAxis);

  svg.append('g')
    .attr('transform', `translate(0, ${(height - pad)})`)
    .attr('class', 'x axis')
    .call(xAxis);

  svg.selectAll('rect').data(dataset)
    .enter().append('rect')
    .attr('width', Math.floor((width - pad * 2) / dataset.length) - 1)
    .attr('height', (d) => height - pad - hScale(d.rating))
    .attr('fill', (d, i) => `rgb(192,${(3 * i) % 192},192)`)
    .attr('x', (d, i) => xScale(i + 0.5))
    .attr('y', (d) => hScale(d.rating));

  svg.selectAll('rect').append('title').data(dataset)
    .text((d) => d.title);

  d3.selectAll('#old')
    .on('click', () => {
      dataset = full_dataset.slice(half);
      bar_w = Math.floor((width - pad * 2) / dataset.length) - 1;

      svg.selectAll('rect').data(dataset)
        .transition().duration(1000)
        .attr('height', (d) => height - pad - hScale(d.rating))
        .attr('fill', (d, i) => `rgb(${100 + (3 * i) % 255},0,0)`)
        .attr('y', (d) => hScale(d.rating))
        .select('title').text(d => d.title);

      xAxis.scale(scaleLin(
        [dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year],
        [pad + bar_w / 2, width - pad - bar_w / 2]));

      d3.select('.x.axis').call(xAxis);
    });

  d3.selectAll('#new')
    .on('click', () => {
      dataset = full_dataset.slice(0, half);
      bar_w = Math.floor((width - pad * 2) / dataset.length) - 1;

      svg.selectAll('rect').data(dataset)
        .transition().duration(1000)
        .attr('height', (d) => height - pad - hScale(d.rating))
        .attr('fill', (d, i) => `rgb(192,${(3 * i) % 192},192)`)
        .attr('y', (d) => hScale(d.rating))
        .select('title').text(d => d.title);

      xAxis.scale(scaleLin(
        [dataset[0].oscar_year, dataset[dataset.length - 1].oscar_year],
        [pad + bar_w / 2, width - pad - bar_w / 2]));

      d3.select('.x.axis').call(xAxis);
    });

  // GRAPH 2

  const svg2 = d3.select('#second_chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg2.selectAll('circle').data(full_dataset)
    .enter().append('circle')
    .attr('r', 5)
    .attr('fill', 'rgba(200,100,200,0.6)')
    .attr('cx', (d) => (d.budget === 0) ? pad : xScale(d.budget / 1000000))
    .attr('cy', (d) => hScale(d.rating))
    .append('title').text((d) => d.title);

  svg2.append('g')
    .attr('transform', `translate(${pad},0)`)
    .attr('class', 'y axis')
    .call(yAxis);

  svg2.append('g')
    .attr('transform', `translate(0, ${(height - pad)})`)
    .attr('class', 'x axis')
    .call(xAxis);

}
