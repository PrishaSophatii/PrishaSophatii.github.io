// Reading progress bar for blog posts
const bar = document.querySelector(".progress");
addEventListener("scroll", () => {
  const h = document.documentElement;
  bar.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
}, { passive: true });
