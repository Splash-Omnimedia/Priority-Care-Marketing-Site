# Priority Care MD — Marketing Website

Static marketing microsite for **Priority Care MD** — *Timely Access. Better Outcomes.*
Built with plain HTML, CSS, and vanilla JavaScript (no build step). Drop it into any static host.

## Pages

| File | Page |
|---|---|
| `index.html` | Home / Overview (immersive flagship) |
| `patients.html` | For Patients |
| `physicians.html` | For Physicians |
| `hospitals.html` | For Hospitals |
| `employers.html` | For Employers / HR |
| `peos.html` | For PEOs |
| `contact.html` | Contact / Get Started (5 audience forms + FAQ) |

## Structure

```
.
├── index.html ... contact.html      # 7 pages
├── assets/
│   ├── styles.css                   # design system + components + theme
│   ├── immersive.css                # home/flagship scenes + animation styles
│   ├── immersive.js                 # nav, smooth scroll, scroll-reveal, forms, FAQ
│   ├── favicon.svg
│   ├── logo-priority-care-md-white.svg   # white/gold logo (used in nav/footer)
│   └── logo-priority-care-md-color.svg   # full-color logo (for light backgrounds)
├── .nojekyll                        # serve folders/files as-is on GitHub Pages
└── .gitignore
```

## Run locally

It's fully static — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000      # then visit http://localhost:8000
```

## Publish on GitHub Pages

1. Create a new repository and add these files at the repo root.
2. Push to `main`.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, select `main` / `/ (root)`, save.
4. The site goes live at `https://<user>.github.io/<repo>/` within a minute or two.

(`.nojekyll` is included so all assets serve correctly.)

## Tech notes

- **Fonts:** Lato via Google Fonts (CDN).
- **Animation:** GSAP + ScrollTrigger + Lenis via cdnjs (CDN). The site degrades gracefully to a fully readable, static page if scripts are blocked or the visitor prefers reduced motion.
- **Brand tokens** (sampled from the Priority Care MD brand): deep royal blue `#002868`, azure, gold `#f0c018`. Defined as CSS variables at the top of `styles.css`.
- **Accessibility:** semantic HTML, skip link, visible focus states, `prefers-reduced-motion` support, ARIA on nav/forms.

## Before going fully live — open items

These are intentionally flagged in the markup as `{NEEDS: ...}` / `{DEV NOTE: ...}`:

- **Member Login** (`#login` in the nav) → point to the real member portal.
- **Forms** (contact page) → connect to a form handler / CRM; wire success + spam protection.
- **Premier Plan pricing** → currently "Contact us" pending final pricing.
- **Photography** → hero/section images are free-license Unsplash placeholders (hotlinked); review/replace with licensed, art-directed shots and consider self-hosting.
- **Footer legal links** → Privacy Policy, Accessibility, Terms currently point to `#`.
- **Global Site Settings** → phone, email, address in the footer.

---

© 2026 Priority Care MD. Website by [Splash Omnimedia](https://splashomnimedia.com/).
