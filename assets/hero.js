// Hero scene: a real 4D object. A tesseract (4D hypercube) rotates through the
// fourth dimension and is projected into 3D, so its inner cube turns inside out.
// Drag to spin it in 3D; move the mouse to steer the 4D rotation.
import * as THREE from "three";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

const canvas = document.getElementById("hero-canvas");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 0, 9);
const key = new THREE.DirectionalLight(0xffe2c2, 1.4);
key.position.set(3, 4, 5);
scene.add(key);

const world = new THREE.Group();
world.rotation.set(0.45, 0.6, 0);
scene.add(world);

/* ---------- Tesseract geometry ---------- */
const verts4 = [];
for (let i = 0; i < 16; i++) verts4.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
const edges = [];
for (let i = 0; i < 16; i++) for (let b = 0; b < 4; b++) { const j = i ^ (1 << b); if (i < j) edges.push([i, j]); }

const coral = new THREE.Color(0xe07a5f), honey = new THREE.Color(0xf4c95d), rose = new THREE.Color(0xe8998d);

// Edges: glossy rods whose colour follows their depth in the 4th dimension
const rodGeo = new THREE.CylinderGeometry(1, 1, 1, 14, 1, true);
const rods = edges.map(() => {
  const m = new THREE.Mesh(rodGeo, new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.3, metalness: 0.1, clearcoat: 1, envMapIntensity: 0.45,
    emissive: 0x000000, emissiveIntensity: 0.55
  }));
  world.add(m);
  return m;
});

// Vertices: pearls with a soft halo
const glowTex = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d"), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,236,200,1)");
  grd.addColorStop(0.25, "rgba(255,190,130,.55)");
  grd.addColorStop(1, "rgba(255,170,120,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();
const pearlGeo = new THREE.SphereGeometry(1, 32, 24);
const nodes = verts4.map(() => {
  const pearl = new THREE.Mesh(pearlGeo, new THREE.MeshPhysicalMaterial({
    color: 0xffc89a, roughness: 0.15, clearcoat: 1, iridescence: 0.6, iridescenceIOR: 1.3, envMapIntensity: 0.6
  }));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  world.add(pearl, halo);
  return { pearl, halo };
});

// Faint glass faces give it volume
const faceMat = new THREE.MeshPhysicalMaterial({
  color: 0xffc9a3, transparent: true, opacity: 0.07, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false
});
const quads = [];
for (let i = 0; i < 16; i++) for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
  if (i & (1 << a) || i & (1 << b)) continue;
  quads.push([i, i | (1 << a), i | (1 << a) | (1 << b), i | (1 << b)]);
}
const faceGeo = new THREE.BufferGeometry();
const facePos = new Float32Array(quads.length * 6 * 3);
faceGeo.setAttribute("position", new THREE.BufferAttribute(facePos, 3));
world.add(new THREE.Mesh(faceGeo, faceMat));

/* ---------- Sparkle dust ---------- */
const dustGeo = new THREE.BufferGeometry();
const dust = new Float32Array(220 * 3);
for (let i = 0; i < 220; i++) {
  const r = 3.4 + Math.random() * 3, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
  dust.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
}
dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  size: 0.1, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.7
}));
scene.add(dustPts);

/* ---------- Interaction ---------- */
let mx = 0, my = 0, sx = 0, sy = 0, dragX = 0, dragY = 0, velX = 0, velY = 0, dragging = false, lx = 0, ly = 0;
addEventListener("pointermove", (e) => {
  mx = e.clientX / innerWidth - 0.5;
  my = e.clientY / innerHeight - 0.5;
  if (dragging) {
    velY = (e.clientX - lx) * 0.005; velX = (e.clientY - ly) * 0.005;
    lx = e.clientX; ly = e.clientY;
  }
});
canvas.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
addEventListener("pointerup", () => (dragging = false));

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.position.z = w / h < 1 ? 11 : 9;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

/* ---------- 4D rotation + projection ---------- */
const P3 = verts4.map(() => new THREE.Vector3());
const W = new Float32Array(16);
const up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), tmp = new THREE.Color();
const SCALE = 2.5, DIST = 3;

function rot(p, i, j, a) {
  const c = Math.cos(a), s = Math.sin(a), u = p[i], v = p[j];
  p[i] = u * c - v * s;
  p[j] = u * s + v * c;
}

const clock = new THREE.Clock();
function tick() {
  const t = clock.getElapsedTime();
  sx += (mx - sx) * 0.04; sy += (my - sy) * 0.04;
  const aXW = t * 0.35 + sx * 2.2, aYW = t * 0.22 + sy * 2.2, aZW = t * 0.12;

  verts4.forEach((v, i) => {
    const p = v.slice();
    rot(p, 0, 3, aXW); rot(p, 1, 3, aYW); rot(p, 2, 3, aZW);
    const k = SCALE / (DIST - p[3]);          // perspective from 4D into 3D
    P3[i].set(p[0] * k, p[1] * k, p[2] * k);
    W[i] = p[3];
    const s = 0.07 + (p[3] + 1.8) * 0.03;
    nodes[i].pearl.position.copy(P3[i]);
    nodes[i].pearl.scale.setScalar(s);
    nodes[i].halo.position.copy(P3[i]);
    nodes[i].halo.scale.setScalar(s * 4.5);
  });

  edges.forEach(([a, b], n) => {
    const m = rods[n];
    dir.subVectors(P3[b], P3[a]);
    const len = dir.length();
    m.position.addVectors(P3[a], P3[b]).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(up, dir.divideScalar(len));
    const depth = ((W[a] + W[b]) / 2 + 1.8) / 3.6;   // 0 = far in 4D, 1 = near
    const r = 0.022 + depth * 0.035;
    m.scale.set(r, len, r);
    tmp.copy(honey).lerp(coral, depth).lerp(rose, Math.max(0, Math.sin(t * 0.5 + n * 0.4)) * 0.25);
    m.material.color.copy(tmp);
    m.material.emissive.copy(tmp);
  });

  quads.forEach((q, n) => {
    const [a, b, c, d] = q.map((i) => P3[i]);
    [a, b, c, a, c, d].forEach((v, k) => facePos.set([v.x, v.y, v.z], (n * 6 + k) * 3));
  });
  faceGeo.attributes.position.needsUpdate = true;

  dragY += velY; dragX += velX;
  velX *= 0.94; velY *= 0.94;
  world.rotation.y = 0.6 + dragY + t * 0.06;
  world.rotation.x = 0.45 + dragX;
  world.position.y = Math.sin(t * 0.8) * 0.06;
  dustPts.rotation.y = t * 0.015;
  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(tick);
}
tick();
