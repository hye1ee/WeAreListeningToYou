import { initializeApp } from "firebase/app";
import { getDatabase, increment, ref, set, update, onValue, get, child } from "firebase/database";

import Connector from "./connector";
import Duck from "./duck";
import "./style.css";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let dataNum = 0;

const getDataById = async (id: number) => {
  return new Promise<any>((res, rej) => {
    get(child(ref(db), "data/" + id)).then((snapshot) => {
      if (snapshot.exists()) {
        res(snapshot.val());
      } else {
        alert("Database Error, Please reload the website");
        rej();
      }
    }).catch((error) => {
      console.error(error);
      rej();
    });
  });
}

const updateDigit = (digit: number) => {
  const newDigit = `000${digit}`.slice(-3);

  const digit0 = document.getElementById("digit0") as HTMLDivElement;
  const digit1 = document.getElementById("digit1") as HTMLDivElement;
  const digit2 = document.getElementById("digit2") as HTMLDivElement;
  digit0.innerText = newDigit.charAt(newDigit.length - 1);
  digit1.innerText = newDigit.charAt(newDigit.length - 2);
  digit2.innerText = newDigit.charAt(newDigit.length - 3);
}

onValue(ref(db, "/dataNum"), async (snapshot) => {
  const newDataNum = snapshot.val();

  for (; dataNum < newDataNum; dataNum++) {
    const newItem = await getDataById(dataNum);
    console.log("Detect new item, with id: ", dataNum, "data: ", newItem);
    document.body.append(new Duck().item);
  }
  updateDigit(dataNum);
})


document.getElementById("button-record")?.addEventListener("click", async () => {
  const { location, date } = await Connector.getInstance().startRecord();
  set(ref(db, '/data/' + dataNum), {
    location: location,
    date: date,
  });
  update(ref(db), { "/dataNum": increment(1) });
})


// import * as d3 from "d3";
// import data from "./graph.json"

// interface NodeData extends d3.SimulationNodeDatum {
//   id: string;
//   group: string;
//   radius?: undefined;
//   citing_patents_count?: undefined;
// }

// interface LinkData extends d3.SimulationNodeDatum {
//   source: string;
//   target: string;
//   value: number;
// }


// // Specify the dimensions of the chart.
// const width = 928;
// const height = 680;

// // Specify the color scale.
// const color = d3.scaleOrdinal(d3.schemeCategory10);

// // The force simulation mutates links and nodes, so create a copy
// // so that re-evaluating this cell produces the same result.
// const links = data.links.map(d => ({ ...d })) as LinkData[];
// const nodes = data.nodes.map(d => ({ ...d })) as NodeData[];

// // Create a simulation with several forces.
// const simulation = d3.forceSimulation(nodes)
//   .force("link", d3.forceLink(links).id(d => d.index ?? -1))
//   .force("charge", d3.forceManyBody())
//   .force("x", d3.forceX())
//   .force("y", d3.forceY());

// // Create the SVG container.
// const svg = d3.create("svg")
//   .attr("width", width)
//   .attr("height", height)
//   .attr("viewBox", [-width / 2, -height / 2, width, height])
//   .attr("style", "max-width: 100%; height: auto;");

// // Add a line for each link, and a circle for each node.
// const link = svg.append("g")
//   .attr("stroke", "#999")
//   .attr("stroke-opacity", 0.6)
//   .selectAll("line")
//   .data(links)
//   .join("line")
//   .attr("stroke-width", d => Math.sqrt(d.value));

// const node = svg.append("g")
//   .attr("stroke", "#fff")
//   .attr("stroke-width", 1.5)
//   .selectAll("circle")
//   .data(nodes)
//   .join("circle")
//   .attr("r", 5)
//   .attr("fill", d => color(d.group));

// node.append("title")
//   .text(d => d.id);

// // Add a drag behavior.
// node.call(d3.drag()
//   .on("start", dragstarted)
//   .on("drag", dragged)
//   .on("end", dragended));

// // Set the position attributes of links and nodes each time the simulation ticks.
// simulation.on("tick", () => {
//   link
//     .attr("x1", d => d.source.x)
//     .attr("y1", d => d.source.y)
//     .attr("x2", d => d.target.x)
//     .attr("y2", d => d.target.y);

//   node
//     .attr("cx", d => d.x)
//     .attr("cy", d => d.y);
// });

// // Reheat the simulation when drag starts, and fix the subject position.
// function dragstarted(event) {
//   if (!event.active) simulation.alphaTarget(0.3).restart();
//   event.subject.fx = event.subject.x;
//   event.subject.fy = event.subject.y;
// }

// // Update the subject (dragged node) position during drag.
// function dragged(event) {
//   event.subject.fx = event.x;
//   event.subject.fy = event.y;
// }

// // Restore the target alpha so the simulation cools after dragging ends.
// // Unfix the subject position now that it’s no longer being dragged.
// function dragended(event) {
//   if (!event.active) simulation.alphaTarget(0);
//   event.subject.fx = null;
//   event.subject.fy = null;
// }

// // When this cell is re-run, stop the previous simulation. (This doesn’t
// // really matter since the target alpha is zero and the simulation will
// // stop naturally, but it’s a good practice.)
// invalidation.then(() => simulation.stop());

// // Append the SVG element.
// document.body.append(svg.node() as SVGSVGElement);