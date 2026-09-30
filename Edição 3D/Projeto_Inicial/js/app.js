import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// CENA, CÂMARA E RENDERER (Ambiente: Ficção Científica / Estúdio Dramático)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050814); // Fundo azul-escuro profundo

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(6, 4, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Sombras ativas
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// MATERIAIS AJUSTADOS
// Objeto Muito Metálico (Cubo)
const cianoMetal = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,
  roughness: 0.1,  // Muito polido
  metalness: 0.95  // Muito metálico
});

// Objeto Semi-Metálico (Esfera)
const magenta = new THREE.MeshStandardMaterial({
  color: 0xd946ef,
  roughness: 0.3,
  metalness: 0.5
});

// Objeto Muito Mate (Toro)
const douradoMate = new THREE.MeshStandardMaterial({
  color: 0xf59e0b,
  roughness: 1.0,  // Totalmente fosco/mate
  metalness: 0.0   // Nada metálico
});

const materialChao = new THREE.MeshStandardMaterial({ 
  color: 0x1e293b, 
  roughness: 0.8 
});

// OBJETOS
const cubo = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), cianoMetal);
cubo.position.set(-2.2, 1, 0);

const esfera = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), magenta);
esfera.position.set(0, 1, 0);

const toro = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.3, 20, 64), douradoMate);
toro.position.set(2.3, 1.1, 0);
toro.rotation.x = Math.PI / 2;

scene.add(cubo, esfera, toro);

// CHÃO
const chao = new THREE.Mesh(new THREE.PlaneGeometry(12, 8), materialChao);
chao.rotation.x = -Math.PI / 2;
chao.receiveShadow = true; // Chão recebe sombra
scene.add(chao);

// SOMBRAS NOS OBJETOS
const objetos = [cubo, esfera, toro];
objetos.forEach(obj => {
  obj.castShadow = true;
  obj.receiveShadow = true;
});

// LUZ AMBIENTE (Mais fraca para efeito dramático)
const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(luzAmbiente);

// LUZ DIRECIONAL (Deslocada e com tom azulado)
const luz = new THREE.DirectionalLight(0x80d8ff, 3.0);
luz.position.set(-5, 6, 3);
luz.castShadow = true;
luz.shadow.mapSize.set(1024, 1024);
scene.add(luz);

// AJUDANTE VISUAL DA LUZ
const helper = new THREE.DirectionalLightHelper(luz, 0.8);
scene.add(helper);

// ESTADO DA APLICAÇÃO
let rodar = true;
let sombras = true;
let intensidadeAmbiente = 0.1;
let focoDireita = false;

function forcarAtualizacaoMateriais() {
  [cianoMetal, magenta, douradoMate, materialChao].forEach(mat => mat.needsUpdate = true);
}

// BOTÕES
document.querySelector("#ambiente").onclick = () => {
  intensidadeAmbiente = intensidadeAmbiente === 0.1 ? 1.0 : 0.1;
  luzAmbiente.intensity = intensidadeAmbiente;
};

document.querySelector("#foco").onclick = () => {
  focoDireita = !focoDireita;
  luz.position.x = focoDireita ? 5 : -5;
  luz.position.z = focoDireita ? 4 : 3;
};

document.querySelector("#sombras").onclick = () => {
  sombras = !sombras;
  renderer.shadowMap.enabled = sombras;
  luz.castShadow = sombras;
  objetos.forEach(obj => obj.castShadow = sombras);
  forcarAtualizacaoMateriais();
};

document.querySelector("#rodar").onclick = () => {
  rodar = !rodar;
};

document.querySelector("#reset").onclick = () => {
  cianoMetal.color.set(0x00ffcc);
  magenta.color.set(0xd946ef);
  douradoMate.color.set(0xf59e0b);
  cianoMetal.roughness = 0.1; cianoMetal.metalness = 0.95;
  magenta.roughness = 0.3; magenta.metalness = 0.5;
  douradoMate.roughness = 1.0; douradoMate.metalness = 0.0;

  cubo.rotation.set(0, 0, 0);
  esfera.rotation.set(0, 0, 0);
  toro.rotation.set(Math.PI / 2, 0, 0);

  luzAmbiente.intensity = 0.1;
  intensidadeAmbiente = 0.1;
  luz.intensity = 3.0;
  luz.position.set(-5, 6, 3);
  focoDireita = false;

  sombras = true;
  renderer.shadowMap.enabled = true;
  luz.castShadow = true;
  objetos.forEach(obj => obj.castShadow = true);
  forcarAtualizacaoMateriais();

  rodar = true;
};

// CICLO DE ANIMAÇÃO
function animar() {
  requestAnimationFrame(animar);

  if (rodar) {
    cubo.rotation.y += 0.008;
    esfera.rotation.y += 0.006;
    toro.rotation.z += 0.008;
  }

  helper.update();
  renderer.render(scene, camera);
}
animar();

// REDIMENSIONAMENTO
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});