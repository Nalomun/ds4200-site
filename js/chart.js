const width = 720;
const height = 420;
const margin = { top: 20, right: 50, bottom: 45, left: 190 };

const svg = d3.select("#chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

d3.csv("data/sector_cohesion.csv").then(function (data) {
  data.forEach(d => {
    d.lift = +d.lift;
  });

  data.sort((a, b) => b.lift - a.lift);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.lift)])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.sector))
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", d => y(d.sector))
    .attr("width", d => x(d.lift) - x(0))
    .attr("height", y.bandwidth());

  svg.selectAll(".value")
    .data(data)
    .join("text")
    .attr("class", "value")
    .attr("x", d => x(d.lift) + 6)
    .attr("y", d => y(d.sector) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text(d => d.lift + "×");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d => d + "×"));

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width - margin.right)
    .attr("y", height - 5)
    .attr("text-anchor", "end")
    .text("times more likely than chance");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));
});
