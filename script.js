/* ===========================================================
   1. MOBILE NAV TOGGLE
   Opens/closes the nav-links menu on small screens.
=========================================================== */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the mobile menu whenever a link is clicked
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ===========================================================
   2. FOOTER YEAR
   Keeps the copyright year current automatically.
=========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===========================================================
   3. ACTIVE NAV LINK ON SCROLL
   Highlights the nav link for whichever section is in view.
=========================================================== */
const sections = document.querySelectorAll("main section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
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

sections.forEach((section) => observer.observe(section));

/* ===========================================================
   4. EMAIL COPY FALLBACK
   The email link opens Gmail's compose window in a new tab
   (works for any visitor, no default mail app required). This
   also copies the address to the clipboard as a bonus, in case
   they'd rather paste it into their own mail client.
=========================================================== */
const emailLink = document.querySelector(".contact-link[data-email]");

if (emailLink) {
  emailLink.addEventListener("click", async () => {
    const email = emailLink.dataset.email;

    try {
      await navigator.clipboard.writeText(email);
      const originalText = emailLink.textContent;
      emailLink.textContent = "copied to clipboard ✓";
      setTimeout(() => {
        emailLink.textContent = originalText;
      }, 1800);
    } catch (err) {
      // Clipboard API unavailable — the Gmail compose tab still opens normally
    }
  });
}
