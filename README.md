# Portfolio

Interactive portfolio for Machine Learning Engineer applications. Static site, no build step, deployed with GitHub Pages.

- `index.html`: hero (Three.js morphing scene), 3D page-turning journey book, projects, skill sphere, blog, contact
- `assets/data.js`: all personal content (journey chapters, projects, skills, links). Edit this to update the site.
- `assets/posts.js` + `blog/*.html`: tech blog posts
- `assets/vendor/three.module.min.js`: Three.js r160 (MIT, see `three-LICENSE`)

Run locally: `python3 -m http.server` and open http://localhost:8000.
