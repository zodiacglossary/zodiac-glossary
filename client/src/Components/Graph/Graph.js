// these options optimize performance for a large number of nodes
export const graphOptions = {
  physics: { stabilization: false },
  layout: { improvedLayout: false },
  edges: { smooth: { type: "continuous" } },
};


export function languageColor(language) {
  return (
    {
      akkadian: "#4e79a7",
      aramaic: "#f28e2b",
      egyptian: "#e15759",
      greek: "#76b7b2",
      hebrew: "#59a14f",
      latin: "#edc948",
    }[language] || "#000"
  );
}


export function openLemma(params) {
  const clickedNodeId = params.nodes[0];
  window.open("https://zodiac.fly.dev/" + clickedNodeId, "_blank");
}