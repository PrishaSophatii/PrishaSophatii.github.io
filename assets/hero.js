// Hero scene: a morphing "4D" form (3D surface displaced through time) orbited by
// floating warm shapes. Drag to spin, move the mouse for parallax.
import * as THREE from "three";

const canvas = document.getElementById("hero-canvas");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
camera.position.set(0, 0, 9);

scene.add(new THREE.HemisphereLight(0xfff1dc, 0x7a3e2e, 1.1));
const key = new THREE.DirectionalLight(0xffd6a8, 2.4);
key.position.set(4, 5, 6);
scene.add(key);
const rim = new THREE.PointLight(0xe07a5f, 40, 20);
rim.position.set(-4, -2, 3);
scene.add(rim);

const world = new THREE.Group();
scene.add(world);

// Central morphing blob
const blobGeo = new THREE.SphereGeometry(1.7, 160, 120);
const base = blobGeo.attributes.position.array.slice();
const blob = new THREE.Mesh(
  blobGeo,
  new THREE.MeshPhysicalMaterial({
    color: 0xf2a65a, roughness: 0.25, metalness: 0.1,
    clearcoat: 1, clearcoatRoughness: 0.15, sheen: 1, sheenColor: new THREE.Color(0xe8998d)
  })
);
world.add(blob);

// Orbiting shapes
const palette = [0xe07a5f, 0xf4c95d, 0xe8998d, 0x81b29a, 0xfff1dc, 0xc8553d];
const geos = [
  new THREE.TorusGeometry(0.32, 0.13, 24, 64),
  new THREE.SphereGeometry(0.28, 32, 32),
  new THREE.OctahedronGeometry(0.34),
  new THREE.TorusKnotGeometry(0.22, 0.08, 96, 12),
  new THREE.BoxGeometry(0.42, 0.42, 0.42)
];
const orbiters = [];
for (let i = 0; i < 14; i++) {
  const m = new THREE.Mesh(
    geos[i % geos.length],
    new THREE.MeshPhysicalMaterial({ color: palette[i % palette.length], roughness: 0.35, clearcoat: 0.8 })
  );
  const o = {
    mesh: m,
    r: 2.6 + Math.random() * 1.4,
    speed: 0.15 + Math.random() * 0.25,
    phase: Math.random() * Math.PI * 2,
    tilt: (Math.random() - 0.5) * 1.6,
    spin: new THREE.Vector3(Math.random(), Math.random(), Math.random()).multiplyScalar(0.02)
  };
  m.scale.setScalar(0.7 + Math.random() * 0.6);
  orbiters.push(o);
  world.add(m);
}

// Sparkle dust
const dustGeo = new THREE.BufferGeometry();
const dust = new Float32Array(400 * 3);
for (let i = 0; i < dust.length; i++) dust[i] = (Math.random() - 0.5) * 14;
dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
world.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xf4c95d, size: 0.04, transparent: true, opacity: 0.8 })));

// Interaction
let targetX = 0, targetY = 0, dragX = 0, dragY = 0, velX = 0, velY = 0, dragging = false, lx = 0, ly = 0;
addEventListener("pointermove", (e) => {
  targetX = (e.clientX / innerWidth - 0.5) * 0.6;
  targetY = (e.clientY / innerHeight - 0.5) * 0.4;
  if (dragging) {
    velY = (e.clientX - lx) * 0.004; velX = (e.clientY - ly) * 0.004;
    lx = e.clientX; ly = e.clientY;
  }
});
canvas.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; });
addEventListener("pointerup", () => (dragging = false));

function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

const pos = blobGeo.attributes.position;
const clock = new THREE.Clock();
function tick() {
  const t = clock.getElapsedTime();
  // Displace along the normal with layered waves: time acts as the 4th dimension
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
    const n = 0.12 * Math.sin(x * 2.1 + t * 0.9) * Math.cos(y * 2.3 + t * 0.7)
            + 0.08 * Math.sin(z * 3.1 + t * 1.3 + x)
            + 0.05 * Math.sin((x + y + z) * 4 + t * 1.7);
    const k = 1 + n;
    pos.setXYZ(i, x * k, y * k, z * k);
  }
  pos.needsUpdate = true;
  blobGeo.computeVertexNormals();

  orbiters.forEach((o) => {
    const a = o.phase + t * o.speed;
    o.mesh.position.set(Math.cos(a) * o.r, Math.sin(a * 1.3) * 0.6 + Math.sin(a) * o.tilt, Math.sin(a) * o.r * 0.6);
    o.mesh.rotation.x += o.spin.x; o.mesh.rotation.y += o.spin.y; o.mesh.rotation.z += o.spin.z;
  });

  dragY += velY; dragX += velX;
  velX *= 0.94; velY *= 0.94;
  world.rotation.y = dragY + t * 0.08 + targetX;
  world.rotation.x = dragX + targetY;
  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(tick);
}
tick();
