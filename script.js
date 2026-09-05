/* ===========================================================
   1. MOBILE NAV TOGGLE
=========================================================== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
 
navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
 
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});
 
/* ===========================================================
   2. DARK MODE TOGGLE
   Remembers the choice in localStorage; falls back to the
   visitor's OS-level preference on first visit.
=========================================================== */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const root = document.documentElement;
 
function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
}
 
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "light");
 
themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});
 
/* ===========================================================
   3. FOOTER YEAR
=========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
 
/* ===========================================================
   4. ACTIVE NAV LINK ON SCROLL
=========================================================== */
const sections = document.querySelectorAll("main section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");
 
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinkEls.forEach((link) => {
          link.style.color = link.getAttribute("href") === `#${id}` ? "var(--accent)" : "";
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);
 
sections.forEach((section) => navObserver.observe(section));
 
/* ===========================================================
   5. EMAIL LINK — COPY TO CLIPBOARD
   The link opens Gmail's web compose in a new tab (works for
   any visitor, no default mail app required). This also copies
   the address to the clipboard as a bonus.
=========================================================== */
const emailLink = document.querySelector(".contact-link[data-email]");
 
if (emailLink) {
  emailLink.addEventListener("click", async () => {
    const email = emailLink.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      const originalText = emailLink.textContent;
      emailLink.textContent = "copied to clipboard ✓";
      setTimeout(() => { emailLink.textContent = originalText; }, 1800);
    } catch (err) {
      // Clipboard API unavailable — the Gmail compose tab still opens normally
    }
  });
}
 
/* ===========================================================
   6. BACK TO TOP BUTTON
=========================================================== */
const backToTop = document.getElementById("backToTop");
 
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});
 
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
 
/* ===========================================================
   7. SHARED MOTION PREFERENCE CHECK
   Used by the animations below (reveal, counters, skill bars,
   and the 3D scene).
=========================================================== */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
/* ===========================================================
   8. SCROLL-REVEAL ANIMATION
   Fades/slides elements in as they enter the viewport, with a
   slight stagger for siblings inside the same grid.
=========================================================== */
const revealEls = document.querySelectorAll(".reveal");
 
revealEls.forEach((el) => {
  const siblingIndex = [...el.parentElement.children].indexOf(el);
  el.style.transitionDelay = `${Math.min(siblingIndex, 4) * 70}ms`;
});
 
if (reducedMotion) {
  revealEls.forEach((el) => el.classList.add("reveal-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}
 
/* ===========================================================
   9. COUNT-UP STATS
   Numbers in the Achievements section count up from 0 to their
   target once, the moment they scroll into view, then stop
   exactly at the target.
=========================================================== */
const countEls = document.querySelectorAll("[data-count]");
 
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const startTime = performance.now();
 
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
 
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
    }
  }
  requestAnimationFrame(tick);
}
 
if (countEls.length) {
  if (reducedMotion) {
    countEls.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  } else {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    countEls.forEach((el) => countObserver.observe(el));
  }
}
 
/* ===========================================================
   10. SKILL BARS
   Each bar fills from 0 to its data-percent width once, when
   scrolled into view.
=========================================================== */
const skillBars = document.querySelectorAll(".skill-bar-fill");
 
if (skillBars.length) {
  if (reducedMotion) {
    skillBars.forEach((bar) => { bar.style.width = bar.dataset.percent + "%"; });
  } else {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.percent + "%";
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((bar) => barObserver.observe(bar));
  }
}
 
/* ===========================================================
   11. SCROLL PROGRESS BAR
   Thin line under the nav that fills as you scroll down the page.
=========================================================== */
const progressBar = document.getElementById("scrollProgress");
 
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = percent + "%";
  });
}
 
/* ===========================================================
   12. REAL 3D SHAPE (Three.js)
   A slow-spinning wireframe icosahedron next to the photo frame
   — actual WebGL geometry, not a faked CSS tilt. Monochrome
   (matches the accent color) and low-key so it stays minimal.
   Skipped entirely if Three.js fails to load or the visitor
   prefers reduced motion.
=========================================================== */
const heroShapeCanvas = document.getElementById("heroShape");
 
if (heroShapeCanvas && window.THREE && !reducedMotion) {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim() || "#3E6259";
 
  const size = heroShapeCanvas.clientWidth || 200;
 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.2;
 
  const renderer = new THREE.WebGLRenderer({
    canvas: heroShapeCanvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(size, size, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 
  const geometry = new THREE.IcosahedronGeometry(1.6, 0);
  const wireframe = new THREE.WireframeGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(accentColor),
    transparent: true,
    opacity: 0.55,
  });
  const shape = new THREE.LineSegments(wireframe, material);
  scene.add(shape);
 
  function resizeShape() {
    const s = heroShapeCanvas.clientWidth || 200;
    renderer.setSize(s, s, false);
  }
  window.addEventListener("resize", resizeShape);
 
  // Gentle continuous spin, no user interaction required
  function animateShape() {
    shape.rotation.x += 0.0025;
    shape.rotation.y += 0.0035;
    renderer.render(scene, camera);
    requestAnimationFrame(animateShape);
  }
  animateShape();
 
  // Re-tint the wireframe if dark mode is toggled after load
  themeToggle.addEventListener("click", () => {
    const newAccent = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent")
      .trim();
    material.color.set(newAccent);
  });
}