const P = window.PORTFOLIO;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Text content ---------- */
$("#hero-name").textContent = P.name.split(" ")[0];
$("#hero-tagline").textContent = P.tagline;
$("#contact-email").href = `mailto:${P.email}`;
$("#contact-github").href = P.github;
$("#contact-linkedin").href = P.linkedin;
$("#footer-name").textContent = P.name;

/* ---------- Chapter illustrations ---------- */
const ICONS = {
  spark: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44" fill="#f4c95d" opacity=".35"/><path d="M60 18l9 31 31 11-31 11-9 31-9-31-31-11 31-11z" fill="#e07a5f"/><circle cx="92" cy="26" r="6" fill="#f2a65a"/></svg>`,
  layers: `<svg viewBox="0 0 120 120"><path d="M60 20l44 22-44 22-44-22z" fill="#e07a5f"/><path d="M16 60l44 22 44-22" fill="none" stroke="#f2a65a" stroke-width="8" stroke-linejoin="round"/><path d="M16 80l44 22 44-22" fill="none" stroke="#f4c95d" stroke-width="8" stroke-linejoin="round"/></svg>`,
  brain: `<svg viewBox="0 0 120 120"><g stroke="#6b4f4f" stroke-width="3" opacity=".5"><line x1="25" y1="30" x2="60" y2="60"/><line x1="25" y1="90" x2="60" y2="60"/><line x1="25" y1="60" x2="60" y2="60"/><line x1="60" y1="60" x2="95" y2="40"/><line x1="60" y1="60" x2="95" y2="80"/><line x1="25" y1="30" x2="60" y2="25"/><line x1="60" y1="25" x2="95" y2="40"/><line x1="25" y1="90" x2="60" y2="95"/><line x1="60" y1="95" x2="95" y2="80"/></g><circle cx="25" cy="30" r="9" fill="#f4c95d"/><circle cx="25" cy="60" r="9" fill="#f4c95d"/><circle cx="25" cy="90" r="9" fill="#f4c95d"/><circle cx="60" cy="25" r="9" fill="#f2a65a"/><circle cx="60" cy="60" r="12" fill="#e07a5f"/><circle cx="60" cy="95" r="9" fill="#f2a65a"/><circle cx="95" cy="40" r="9" fill="#e8998d"/><circle cx="95" cy="80" r="9" fill="#e8998d"/></svg>`,
  rocket: `<svg viewBox="0 0 120 120"><path d="M60 12c22 14 28 40 20 66H40C32 52 38 26 60 12z" fill="#e07a5f"/><circle cx="60" cy="48" r="10" fill="#fff6ec"/><path d="M40 78l-14 14 18-2zM80 78l14 14-18-2z" fill="#f2a65a"/><path d="M50 82h20l-10 26z" fill="#f4c95d"/></svg>`,
  eye: `<svg viewBox="0 0 120 120"><path d="M10 60c20-30 80-30 100 0-20 30-80 30-100 0z" fill="#f6e1c8" stroke="#e07a5f" stroke-width="5"/><circle cx="60" cy="60" r="20" fill="#e07a5f"/><circle cx="60" cy="60" r="8" fill="#3d2c2e"/><circle cx="66" cy="53" r="4" fill="#fff6ec"/><path d="M18 30l8 8M102 30l-8 8M60 14v12" stroke="#f4c95d" stroke-width="5" stroke-linecap="round"/></svg>`,
  star: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="#f4c95d" opacity=".3"/><path d="M60 14l13 28 30 3-23 20 7 30-27-16-27 16 7-30-23-20 30-3z" fill="#f2a65a" stroke="#e07a5f" stroke-width="4" stroke-linejoin="round"/></svg>`,
  bag: `<svg viewBox="0 0 120 120"><rect x="22" y="40" width="76" height="66" rx="12" fill="#e07a5f"/><path d="M42 48V36a18 18 0 0136 0v12" fill="none" stroke="#6b4f4f" stroke-width="7" stroke-linecap="round"/><path d="M60 64l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#f4c95d"/></svg>`
};

/* ---------- 3D book ---------- */
function buildBook() {
  const book = $("#book");
  const ch = P.journey;
  const pages = []; // [{front, back}]
  pages.push({
    front: `<div class="face cover"><div class="emboss"><small>A journey in chapters</small><h3>${esc(P.name)}</h3><p style="color:#fff3e6;margin:12px 0 0">${esc(P.role)}</p></div><div class="pageno" style="color:#fff3e6">tap to open</div></div>`,
    back: illusPage(ch[0], 1)
  });
  ch.forEach((c, i) => {
    pages.push({
      front: `<div class="face"><div class="chapter">${esc(c.year)}</div><h4>${esc(c.title)}</h4><div class="place">${esc(c.place)}</div><p>${esc(c.text)}</p><div>${c.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div><div class="pageno">${i * 2 + 2}</div></div>`,
      back: i < ch.length - 1
        ? illusPage(ch[i + 1], i * 2 + 3)
        : `<div class="face back inside-cover"><h4>To be continued…</h4><p>The best chapters are the ones still being written.</p><p><a href="#contact">Let's write the next one together →</a></p><div class="pageno">${i * 2 + 3}</div></div>`
    });
  });
  pages.push({
    front: `<div class="face inside-cover"><h4>Thank you for reading</h4><p>${esc(P.email)}</p><p><a href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a> · <a href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></p></div>`,
    back: `<div class="face back cover" style="align-items:center;text-align:center"><small>fin</small></div>`
  });

  function illusPage(c, n) {
    return `<div class="face back"><div class="chapter">${esc(c.year)}</div><div class="illus">${ICONS[c.icon] || ICONS.spark}</div><div class="pageno">${n}</div></div>`;
  }

  const leaves = pages.map((p) => {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.innerHTML = p.front + p.back;
    book.appendChild(leaf);
    return leaf;
  });

  let current = 0; // number of flipped leaves
  const total = leaves.length;
  function render() {
    leaves.forEach((leaf, i) => {
      const flipped = i < current;
      leaf.classList.toggle("flipped", flipped);
      // A small z offset keeps the stacked pages from z-fighting (negated when flipped,
      // because the translate happens in the rotated frame)
      leaf.style.zIndex = flipped ? i : total - i;
      leaf.style.transform = `${flipped ? "rotateY(-180deg)" : "rotateY(0deg)"} translateZ(${flipped ? -i * 0.6 : (total - i) * 0.6}px)`;
    });
    // Center the visible half of the book: closed shows right page, finished shows left page
    shift = current === 0 ? -25 : current === total ? 25 : 0;
    applyTransform();
    $("#book-progress").textContent = current === 0 ? "Closed" : current === total ? "The end" : `Page ${current * 2 - 1}–${current * 2}`;
  }
  const go = (d) => { current = Math.max(0, Math.min(total, current + d)); render(); };
  $("#book-prev").onclick = () => go(-1);
  $("#book-next").onclick = () => go(1);
  $("#book-reset").onclick = () => { current = 0; rx = 14; ry = -14; render(); };

  // Drag to rotate in 3D, click to turn pages
  const stage = $("#book-stage");
  let rx = 14, ry = -14, shift = -25, dragging = false, moved = 0, sx = 0, sy = 0, t0 = performance.now();
  function applyTransform() {
    const bob = reduceMotion || dragging ? 0 : Math.sin((performance.now() - t0) / 1400) * 1.5;
    book.style.transform = `translateX(${shift}%) rotateX(${rx + bob}deg) rotateY(${ry}deg)`;
  }
  stage.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; sx = e.clientX; sy = e.clientY; book.style.transition = "none"; });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    moved += Math.abs(dx) + Math.abs(dy);
    sx = e.clientX; sy = e.clientY;
    ry = Math.max(-55, Math.min(55, ry + dx * 0.35));
    rx = Math.max(-10, Math.min(55, rx - dy * 0.35));
    applyTransform();
  });
  addEventListener("pointerup", (e) => {
    if (!dragging) return;
    dragging = false;
    book.style.transition = "";
    if (moved < 6) {
      const leaf = e.target.closest(".leaf");
      if (leaf && !e.target.closest("a")) go(leaf.classList.contains("flipped") ? -1 : 1);
    }
  });
  stage.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
  // Gentle floating motion over time
  if (!reduceMotion) (function loop() { if (!dragging) { book.style.transition = "transform .6s"; applyTransform(); } setTimeout(() => requestAnimationFrame(loop), 120); })();
  render();
}
buildBook();

/* ---------- Projects and blog cards ---------- */
$("#project-grid").innerHTML = P.projects.map((p, i) => `
  <${p.link ? `a href="${esc(p.link)}" target="_blank" rel="noopener"` : "div"} class="tilt reveal">
    <span class="glare"></span>
    <div class="num">${String(i + 1).padStart(2, "0")}</div>
    <h3>${esc(p.name)}</h3><p>${esc(p.blurb)}</p>
    <div>${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
  </${p.link ? "a" : "div"}>`).join("");

$("#blog-grid").innerHTML = window.POSTS.map((p) => `
  <a class="tilt post-card reveal" href="blog/${p.slug}.html">
    <span class="glare"></span>
    <div class="meta">${esc(p.date)} · ${esc(p.read)} read</div>
    <h3 style="margin-top:10px">${esc(p.title)}</h3><p>${esc(p.summary)}</p>
    <div class="meta" style="color:var(--muted);font-weight:500">Inspired by: ${esc(p.inspired)}</div>
    <div class="read">Read post →</div>
  </a>`).join("");

/* ---------- Impact counters ---------- */
$("#stat-grid").innerHTML = P.stats.map((st, i) => `
  <div class="tilt stat reveal">
    <span class="glare"></span>
    <div class="stat-num" data-i="${i}">${esc(st.prefix || "")}${st.from}${esc(st.suffix)}</div>
    ${st.from ? `<div class="meta">from ${st.from}${esc(st.suffix)}</div>` : ""}
    <p>${esc(st.label)}</p>
  </div>`).join("");
const countIo = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  countIo.unobserve(e.target);
  const st = P.stats[e.target.dataset.i], d = st.decimals || 0, t0 = performance.now(), dur = reduceMotion ? 0 : 1800;
  (function step(now) {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, ease = 1 - Math.pow(1 - k, 3);
    e.target.textContent = `${st.prefix || ""}${(st.from + (st.to - st.from) * ease).toFixed(d)}${st.suffix}`;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: 0.6 });
document.querySelectorAll(".stat-num").forEach((el) => countIo.observe(el));

/* ---------- Tilt effect ---------- */
document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 14}deg) rotateY(${(x - 0.5) * 16}deg) scale(1.02)`;
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

/* ---------- Skills sphere ---------- */
(function sphere() {
  const el = $("#sphere");
  const items = P.skills.map((s) => { const n = document.createElement("span"); n.textContent = s; el.appendChild(n); return n; });
  const N = items.length;
  const pts = items.map((_, i) => {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
    return [Math.cos(th) * r, y, Math.sin(th) * r];
  });
  let ax = 0.3, ay = 0, vx = 0.002, vy = 0.004, drag = false, lx = 0, ly = 0;
  el.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; ly = e.clientY; });
  addEventListener("pointerup", () => (drag = false));
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    vy = (e.clientX - lx) * 0.0006; vx = -(e.clientY - ly) * 0.0006;
    lx = e.clientX; ly = e.clientY;
  });
  function frame() {
    const R = Math.min(el.clientWidth, el.clientHeight) * 0.4;
    ax += vx; ay += vy;
    if (!drag) { vx += (0.0015 - vx) * 0.02; vy += (0.004 - vy) * 0.02; }
    const [cx, sx, cy, sy] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay)];
    pts.forEach(([x, y, z], i) => {
      const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
      const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      const s = (z2 + 2) / 3;
      items[i].style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px, ${y2 * R}px, 0) scale(${0.6 + s * 0.6})`;
      items[i].style.opacity = 0.25 + s * 0.75;
      items[i].style.zIndex = Math.round(s * 100);
    });
    if (!reduceMotion) requestAnimationFrame(frame);
  }
  frame();
})();

/* ---------- Reveal + active nav ---------- */
const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
const navIo = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach((s) => navIo.observe(s));
