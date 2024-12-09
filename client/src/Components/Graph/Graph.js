import * as d3 from "d3";

const width = window.innerWidth;
const height = window.innerHeight;

const drag = (simulation) => {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export function createGraph(nodes, links) {
  const zoom = d3.zoom()
    .scaleExtent([0.1, 7])
    .on("zoom", zoomed);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links)
        .id((d) => d.id)
        .distance(50)
      .strength(0.1)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

   for (let i = 0; i < 50; i++) { simulation.tick(); }

  const svg = d3.select("body")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .classed("svg-content-responsive", true)
    .call(zoom);

  const graphContainer = svg.append("g");

  const link = graphContainer
    .append("g")
    .attr("stroke", "#ffd")
    .attr("stroke-opacity", 1)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 1);

  const node = graphContainer
    .append("g")
    .attr("stroke", "#ffd")
    .attr("stroke-width", 0.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", c => c.isCategory ? 12 : 7)
    .attr("fill", (c) => c.isCategory ? "white" : ({
      "akkadian": "#4e79a7",
      "aramaic": "#f28e2b",
      "egyptian": "#e15759",
      "greek": "#76b7b2",
      "hebrew": "#59a14f",
      "latin": "#edc948"
    }[c.language]))
    .call(drag(simulation))
    .on("click", (event, d) => {
      window.open("https://zodiac.fly.dev/" + d.id, "_blank");
    });

  node.append("title").text((d) => [d.original, d.transliteration, d.id].filter(Boolean).join(" | "));
  link.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  function zoomed(event) {
    graphContainer.attr("transform", event.transform);
  }
}
