import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const robo = new THREE.Group();
scene.add(robo);

function mesh(geometria, cor) {
  return new THREE.Mesh(geometria, new THREE.MeshBasicMaterial({ color: cor }));
}

// CORPO
const corpo = mesh(new THREE.BoxGeometry(0.6, 1, 0.9), 0x0866ff);
robo.add(corpo);

// CABEÇA
const cabeca = mesh(new THREE.BoxGeometry(3.3, 2.05, 1), 0xd9d9d9);
cabeca.position.y = 1.65;
robo.add(cabeca);

// BRAÇOS
const bracoE = mesh(new THREE.BoxGeometry(0.35, 1.8, 0.4), 0xffffff);
bracoE.position.set(-1, 0.05, 0);
const bracoD = bracoE.clone();
bracoD.position.x = 1;
robo.add(bracoE, bracoD);

// PERNAS
const pernaE = mesh(new THREE.BoxGeometry(0.5, 2.6, 0.55), 0x1800ad);
pernaE.position.set(-0.48, -1.75, 0);
const pernaD = pernaE.clone();
pernaD.position.x = 0.48;
robo.add(pernaE, pernaD);

// OLHOS
const olhoE = mesh(new THREE.SphereGeometry(0.24, 16, 8), 0x111111);
olhoE.position.set(-0.9, 1.75, 0.55);
const olhoD = olhoE.clone();
olhoD.position.x = 0.9;
robo.add(olhoE, olhoD);

// ANTENA
const haste = mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 12), 0xe2e8f0);
haste.position.y = 2.55;
const ponta = mesh(new THREE.SphereGeometry(0.14, 16, 8), 0xeffde59);
ponta.position.y = 3.55;
robo.add(haste, ponta);

let velocidade =1;
let pausado = false;
let acenar = false;
let tempo = 0;

function animar() {
  requestAnimationFrame(animar);
  if (!pausado) {
    robo.rotation.y += 0.03 * velocidade;
    tempo += 0.05 * velocidade;
    if (acenar) bracoD.rotation.z = Math.sin(tempo) * 1.5;
  }
  renderer.render(scene, camera);
}
animar();

document.querySelector("#pausa").onclick = function() {
  pausado = !pausado;
  this.textContent = pausado ? "Continuar" : "Pausar";
};
document.querySelector("#lento").onclick = () => velocidade = 2;
document.querySelector("#normal").onclick = () => velocidade = 5;
document.querySelector("#rapido").onclick = () => velocidade = 9.5;
document.querySelector("#acenar").onclick = function() {
  acenar = !acenar;
  this.textContent = acenar ? "Parar braço" : "Acenar";
  if (!acenar) bracoD.rotation.z = 0;
};
document.querySelector("#reset").onclick = () => {
  velocidade=1; pausado=false; acenar=false; tempo=0;
  robo.rotation.set(0,0,0); bracoD.rotation.set(0,0,0);
  document.querySelector("#pausa").textContent="Pausar";
  document.querySelector("#acenar").textContent="Acenar";
};
addEventListener("resize", () => {
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});