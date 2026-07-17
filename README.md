# Mohammad Ahmad — Premium Developer Portfolio Website

A recruiter-focused, single-page portfolio website designed to showcase systems engineering, backend architectures, DevOps, cloud infrastructure, and AI development skills. 

This project is built from scratch without external frameworks, libraries, or compilation steps. It is fully functional, highly responsive, and optimized for immediate loading directly in a browser.

---

## ⚡ Performance & Core Characteristics

- **Zero Build Tooling:** Native HTML5, modern vanilla CSS3 (utilizing layout flex/grid systems and custom tokens), and pure ES6+ JavaScript.
- **Persistent Theming:** Premium Dark Theme default with a switchable, modern Light Theme saved directly to the client's `localStorage`.
- **High-Performance Canvas Background:** Interactive distributed node graph canvas animation that dynamically scales to viewport area, links nearby nodes, and reacts to pointer movements.
- **Visual Product Storytelling:** Projects are presented with dedicated technical details, including challenge narratives, performance metrics, and responsive system architecture maps.
- **Micro-interactions:** Custom cursor hover glows, text auto-typing loop sequences, dynamic scroll progress metrics, active page scrollspy tracking, copy-to-clipboard utilities, and live validated contact forms.
- **A11y & SEO Compliance:** Semantic markup structure with optimized meta viewport definitions, Open Graph (OG) social parameters, ARIA landmark identifiers, and accessible input fields.

---

## 📂 Project Directory Structure

```text
Portfolio/
│
├── index.html          # Semantic HTML structure & metadata configuration
├── style.css           # Design tokens, layout grids, and interactive transitions
├── script.js           # Theme storage, scrollspy, typing loop, canvas logic, and validation
│
├── assets/
│   ├── images/         # High-resolution screenshots and product views
│   ├── icons/          # System design diagrams and category badges
│   ├── resume.pdf      # Complete PDF resume (linked to download actions)
│   └── favicon.ico     # Custom brand favicon shortcut icon
│
└── README.md           # Engineering documentation and customization guidelines
```

---

## 🚀 How to Run Locally

Since this site uses vanilla web standards, it does not require an active compilation pipeline or node module installations.

### Method 1: Direct File Access
1. Clone or download the folder.
2. Double-click [index.html](file:///index.html) to run it directly inside any modern web browser.

### Method 2: Local HTTP Server (Recommended)
Running through an HTTP server resolves cross-origin checks for embedded assets and scripts:
- **Python 3:** Run `python -m http.server 8000` from the `Portfolio` root directory, and visit `http://localhost:8000`.
- **Node.js (NPX):** Run `npx serve` or `npm install -g serve` followed by `serve`, and visit `http://localhost:3000`.
- **VS Code Extension:** Click "Go Live" using the Live Server extension.

---

## 🛠️ Customization Guide

### Customizing Theme Tokens (Colors & Shadows)
Colors are maintained as CSS custom properties inside [style.css](file:///style.css). You can adapt the brand palette by modifying variables in the `:root[data-theme="dark"]` and `:root[data-theme="light"]` blocks:

```css
:root[data-theme="dark"] {
    --bg-primary: #030712;      /* Deep primary surface */
    --bg-card: #0f172a;         /* High-contrast element panels */
    --color-primary: #3b82f6;    /* Core accent blue */
    --color-secondary: #8b5cf6;  /* Highlighting purple */
}
```

### Modifying the Typing Text headlines
To change the rolling headline categories in the Hero section, edit the `TYPED_STRINGS` array at the top of [script.js](file:///script.js):

```javascript
const TYPED_STRINGS = [
    "Backend & Distributed Systems Engineer",
    "Cloud Infrastructure Enthusiast",
    "AI-Powered Application Developer"
];
```

### Canvas Animation Density
To adjust the density of particles floating on the canvas background, update the `particleDensityScale` value in [script.js](file:///script.js):

```javascript
let particleDensityScale = 0.00008; // Reduce for fewer particles, increase for more
```

---

## 🌐 Deployment Instructions

### Deployment to GitHub Pages
1. Push the contents of the `Portfolio` folder to a repository on GitHub (e.g., `https://github.com/your-username/portfolio`).
2. Go to the repository **Settings** tab.
3. Scroll to **Pages** in the left sidebar under the "Code and automation" section.
4. Select the build branch (usually `main` or `master`) and directory folder (usually `/ (root)`).
5. Click **Save**. The live URL will be active in minutes (typically `https://your-username.github.io/portfolio`).

### Deployment to Vercel
1. Install Vercel CLI via `npm install -g vercel` or link your GitHub account directly on the Vercel dashboard.
2. Run `vercel` from the `Portfolio` folder.
3. Configure the directory settings and hit deploy. Vercel automatically hosts the static project and returns a preview URL.

### Deployment to Netlify
1. Log in to Netlify and click **Add new site** > **Deploy manually**.
2. Drag and drop the `Portfolio` folder onto the browser interface.
3. Set your custom site name, and the deployment goes live instantly.
