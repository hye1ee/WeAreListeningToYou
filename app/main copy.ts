import "./style.css"

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const networkData = {
  "nodes": [
    { "id": "id1", "name": "Node 1", "val": 8 },
    { "id": "id2", "name": "Node 2", "val": 12 },
    { "id": "id3", "name": "Node 3", "val": 5 },
    { "id": "id4", "name": "Node 4", "val": 15 },
    { "id": "id5", "name": "Node 5", "val": 7 },
    { "id": "id6", "name": "Node 6", "val": 10 },
    { "id": "id7", "name": "Node 7", "val": 3 },
    { "id": "id8", "name": "Node 8", "val": 9 },
    { "id": "id9", "name": "Node 9", "val": 11 },
    { "id": "id10", "name": "Node 10", "val": 6 }
  ],
  "links": [
    { "source": "id1", "target": "id2" },
    { "source": "id1", "target": "id3" },
    { "source": "id1", "target": "id4" },
    { "source": "id2", "target": "id5" },
    { "source": "id2", "target": "id6" },
    { "source": "id3", "target": "id7" },
    { "source": "id3", "target": "id8" },
    { "source": "id4", "target": "id9" },
    { "source": "id4", "target": "id10" },
    { "source": "id5", "target": "id6" },
    { "source": "id6", "target": "id9" },
    { "source": "id7", "target": "id8" },
    { "source": "id8", "target": "id10" }
  ]
};

import { forceSimulation } from "d3-force-3d";

const simulation = forceSimulation(nodes);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);


// // Create spheres for nodes with random position
// const nodes = networkData.nodes.map(node => {
//   const geometry = new THREE.SphereGeometry(node.val / 2, 32, 32);
//   const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
//   const sphere = new THREE.Mesh(geometry, material);
//   sphere.position.set(Math.random() * 50 - 25, Math.random() * 50 - 25, Math.random() * 50 - 25);
//   scene.add(sphere);
//   return { id: node.id, sphere };
// });


// // Create lines for links
// const links = networkData.links.map((link, idx) => {
//   const sourceNode = nodes.find(node => node.id === link.source);
//   const targetNode = nodes.find(node => node.id === link.target);
//   const points = [];
//   if (sourceNode) points.push(sourceNode.sphere.position.clone());
//   if (targetNode) points.push(targetNode.sphere.position.clone());

//   const material = new THREE.LineBasicMaterial({ color: 0xffffff });
//   const geometry = new THREE.BufferGeometry().setFromPoints(points);

//   geometry.name = `link${idx}`
//   const line = new THREE.Line(geometry, material);
//   scene.add(line);
//   return { line, sourceNodeId: link.source, targetNodeId: link.target };
// });



// // Force-directed layout simulation parameters
// const dampingFactor = 0.5;
// const springStrength = 0.01;



// camera.position.z = 50;
// const controls = new OrbitControls(camera, renderer.domElement);

// // Render loop
// function animate() {
//   requestAnimationFrame(animate);

//   // Update node positions based on force-directed layout algorithm
//   nodes.forEach((node, idx) => {
//     const force = new THREE.Vector3();
//     nodes.forEach(otherNode => {
//       if (node.id !== otherNode.id) {
//         const direction = new THREE.Vector3().subVectors(otherNode.sphere.position.clone(), node.sphere.position.clone());
//         const distance = direction.length();
//         const springForce = direction.multiplyScalar(distance * springStrength);
//         force.add(springForce);
//       }
//     });
//     if (idx === 0) {
//       console.log(force)
//       node.sphere.position.add(force);
//     }
//   });

//   // // Update line positions
//   // links.forEach(({ line, sourceNodeId, targetNodeId }) => {
//   //   const sourceNode = nodes.find(node => node.id === sourceNodeId);
//   //   const targetNode = nodes.find(node => node.id === targetNodeId);

//   //   const points = [];
//   //   if (sourceNode) points.push(sourceNode.sphere.position.clone());
//   //   if (targetNode) points.push(targetNode.sphere.position.clone());

//   //   line.geometry.setFromPoints(points);
//   //   line.geometry.attributes.position.needsUpdate = true;
//   // });

//   // Apply damping to slow down movement
//   nodes.forEach((node, idx) => {
//     if (idx === 0) node.sphere.position.multiplyScalar(dampingFactor);
//   });

//   controls.update();
//   renderer.render(scene, camera);
// }


// animate();

