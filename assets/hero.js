// Hero scene: a pearly form that flows through time (the "4D" part: 3D noise
// advected by time), wrapped in gold rings and drifting pearls.
// Drag to spin, move the mouse for parallax.
import * as THREE from "three";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

const canvas = document.getElementById("hero-canvas");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 0, 9);

const key = new THREE.DirectionalLight(0xffe2c2, 1.6);
key.position.set(3, 4, 5);
scene.add(key);
const warm = new THREE.PointLight(0xff8a65, 30, 18);
warm.position.set(-3.5, -2, 3);
scene.add(warm);

const world = new THREE.Group();
scene.add(world);

/* ---------- The flowing pearl ---------- */
const uniforms = { uTime: { value: 0 } };
const NOISE = /* glsl */ `
  // Ashima Arts 3D simplex noise (MIT)
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  uniform float uTime;
  // Smooth, slow, layered flow: time drifts the noise field (the 4th dimension)
  float field(vec3 p){
    vec3 q = p * 0.75 + vec3(0.0, uTime * 0.2, uTime * 0.12);
    return snoise(q) * 0.14 + snoise(q * 1.5 + 3.7) * 0.02;
  }
  vec3 displaced(vec3 p){ vec3 n = normalize(p); return p + n * field(n); }
`;

const pearlMat = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.2,
  metalness: 0.0,
  clearcoat: 1,
  clearcoatRoughness: 0.08,
  iridescence: 0.4,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [200, 480],
  sheen: 0.35,
  sheenColor: new THREE.Color(0xffb38a),
  envMapIntensity: 0.3
});
pearlMat.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = uniforms.uTime;
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", `#include <common>\n${NOISE}\nvarying float vField;\nvarying vec3 vObj;`)
    .replace("#include <beginnormal_vertex>", `
      // Rebuild the normal from neighbouring displaced points
      vec3 dp = displaced(position);
      vec3 tangent = normalize(cross(normal, abs(normal.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
      vec3 bitangent = cross(normal, tangent);
      float eps = 0.01;
      vec3 pa = displaced(position + tangent * eps);
      vec3 pb = displaced(position + bitangent * eps);
      vec3 objectNormal = normalize(cross(pa - dp, pb - dp));
      if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
      #ifdef USE_TANGENT
        vec3 objectTangent = vec3(tangent);
      #endif`)
    .replace("#include <begin_vertex>", `vec3 transformed = dp; vField = field(normalize(position)); vObj = normalize(position);`);
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", `#include <common>\nvarying float vField;\nvarying vec3 vObj;\nuniform float uTime;`)
    .replace("#include <color_fragment>", `
      // Warm sunset gradient that shifts with the surface flow
      vec3 peach = vec3(0.98, 0.58, 0.38);
      vec3 rose  = vec3(0.86, 0.36, 0.40);
      vec3 honey = vec3(0.98, 0.76, 0.30);
      vec3 coral = vec3(0.80, 0.30, 0.22);
      float g = vObj.y * 0.5 + 0.5;
      vec3 c = mix(coral, peach, smoothstep(0.0, 0.55, g));
      c = mix(c, honey, smoothstep(0.55, 1.0, g));
      c = mix(c, rose, smoothstep(-0.05, 0.2, vField) * 0.6);
      diffuseColor.rgb *= c * c * 1.15;`);
};
const pearl = new THREE.Mesh(new THREE.SphereGeometry(1.45, 256, 192), pearlMat);
world.add(pearl);

/* ---------- Gold rings ---------- */
const gold = new THREE.MeshPhysicalMaterial({ color: 0xf2c27b, metalness: 1, roughness: 0.22, clearcoat: 0.6, envMapIntensity: 1.4 });
const rings = [
  { r: 2.25, tube: 0.022, tilt: [1.15, 0.25, 0], speed: 0.25 },
  { r: 2.6, tube: 0.012, tilt: [1.35, -0.5, 0.3], speed: -0.18 },
  { r: 2.95, tube: 0.008, tilt: [0.9, 0.6, -0.2], speed: 0.12 }
].map((o) => {
  const m = new THREE.Mesh(new THREE.TorusGeometry(o.r, o.tube, 16, 220), gold);
  m.rotation.set(...o.tilt);
  world.add(m);
  return { mesh: m, ...o };
});

/* ---------- Drifting pearls ---------- */
const beadMats = [0xfff3e6, 0xf6c1a8, 0xf4c95d, 0xe8998d].map((c) => new THREE.MeshPhysicalMaterial({
  color: c, roughness: 0.15, clearcoat: 1, iridescence: 0.8, iridescenceIOR: 1.3, envMapIntensity: 1.1
}));
const beadGeo = new THREE.SphereGeometry(1, 48, 32);
const beads = [];
for (let i = 0; i < 12; i++) {
  const m = new THREE.Mesh(beadGeo, beadMats[i % beadMats.length]);
  const ring = rings[i % rings.length];
  m.scale.setScalar(0.05 + Math.random() * 0.09);
  // Beads ride along the rings so the motion reads as an orbit, not noise
  const holder = new THREE.Group();
  holder.rotation.copy(ring.mesh.rotation);
  holder.add(m);
  world.add(holder);
  beads.push({ m, r: ring.r, a: Math.random() * Math.PI * 2, speed: ring.speed * (0.8 + Math.random() * 0.8) });
}

/* ---------- Soft sparkle dust ---------- */
const dustGeo = new THREE.BufferGeometry();
const dust = new Float32Array(260 * 3);
for (let i = 0; i < 260; i++) {
  const r = 3 + Math.random() * 3.5, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
  dust.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
}
dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
const sprite = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,240,210,1)");
  grd.addColorStop(0.4, "rgba(255,200,140,.5)");
  grd.addColorStop(1, "rgba(255,200,140,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const dustPts = new THREE.Points(dustGeo, new THREE.PointsMaterial({
  size: 0.12, map: sprite, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8
}));
world.add(dustPts);

/* ---------- Interaction ---------- */
let targetX = 0, targetY = 0, px = 0, py = 0, dragX = 0, dragY = 0, velX = 0, velY = 0, dragging = false, lx = 0, ly = 0;
addEventListener("pointermove", (e) => {
  targetX = (e.clientX / innerWidth - 0.5) * 0.5;
  targetY = (e.clientY / innerHeight - 0.5) * 0.35;
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
  // Pull back on narrow screens so the rings stay in frame
  camera.position.z = w / h < 1 ? 11.5 : 9;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(canvas);
resize();

const clock = new THREE.Clock();
function tick() {
  const t = clock.getElapsedTime();
  uniforms.uTime.value = t;

  rings.forEach((o) => { o.mesh.rotation.z = t * o.speed; });
  beads.forEach((b) => {
    const a = b.a + t * b.speed;
    b.m.position.set(Math.cos(a) * b.r, Math.sin(a) * b.r, 0);
  });
  dustPts.rotation.y = t * 0.02;
  pearl.rotation.y = t * 0.1;

  dragY += velY; dragX += velX;
  velX *= 0.94; velY *= 0.94;
  px += (targetX - px) * 0.05; py += (targetY - py) * 0.05;
  world.rotation.y = dragY + px;
  world.rotation.x = dragX + py + Math.sin(t * 0.4) * 0.05;
  world.position.y = Math.sin(t * 0.8) * 0.06;
  renderer.render(scene, camera);
  if (!reduceMotion) requestAnimationFrame(tick);
}
tick();
