# SmartBrief AI — Changelog

## 2026-03-16

### Files modified: index.html, smartbrief-dashboard.html, smartbrief-patient.html
### Files created: analytics-setup-guide.html, CHANGELOG.md

---

### Task 1 — WhatsApp Links Fixed

**index.html** (3 links updated):
- Line 306: `https://wa.me/` → `https://wa.me/919488907730?text=Hi%2C%20I%20want%20to%20try%20SmartBrief%20AI.` ("Try on WhatsApp" hero CTA)
- Line 649: `https://wa.me/` → `https://wa.me/919488907730?text=Hi%2C%20I%27m%20interested%20in%20the%20SmartBrief%20AI%20beta%20for%20my%20clinic.` ("Request Beta Access" beta section CTA)
- Line 704: `https://wa.me/` → `https://wa.me/919488907730?text=Hi%2C%20I%20have%20a%20question%20about%20SmartBrief%20AI.` ("Contact" footer link)

**smartbrief-dashboard.html** (7 links updated):
- Lines 1750, 1850, 1899, 2339, 2501: `https://wa.me/?text=` → `https://wa.me/919488907730?text=` (shareWA, shareRxWA, shareDocWA, shareAiBriefWA, shareNoteWA functions)
- Lines 1945–1946: `waLink:'https://wa.me/'` → `waLink:'https://wa.me/919488907730'` (demo reminder data objects)
- Line 1910 intentionally unchanged: `https://wa.me/'+(ph.replace(/\D/g,''))` — dynamically uses patient's own phone number for follow-up reminders

**smartbrief-patient.html** (1 link updated):
- Line 619: `https://wa.me/?text=` → `https://wa.me/919488907730?text=` (shareWA function)

---

### Task 2 — Dashboard URL

No changes required. All inter-file links use relative paths (`smartbrief-dashboard.html`, `smartbrief-patient.html`) which are correct since all three files reside in the same `/portal/` directory on GitHub Pages. No absolute `https://smartbriefai.github.io/smartbrief-dashboard.html` URLs were found in any file.

---

### Task 3 — Analytics Layer

**analytics-setup-guide.html** (new file):
- Created complete step-by-step setup guide for connecting to Google Sheets via Apps Script
- Includes full Apps Script code (doPost function + testPost helper)
- Includes deployment instructions with screenshot descriptions
- Includes column header reference and privacy notes

**index.html** — analytics `<script>` block added before `</body>`:
- Tracks: page_view, cta_click, specialty_switch, pricing_toggle, roi_slider_change, section_view
- IntersectionObserver for section_view with 300ms setTimeout fallback (same pattern as existing reveal logic)
- Pricing toggle: listens on `#annualToggle` change event
- ROI sliders: listens on `#ppdSlider` and `#dpmSlider` input events, debounced 500ms
- Specialty tabs: listens on `.nav-tab` click events

**smartbrief-dashboard.html** — analytics `<script>` block added before `</body>`:
- Tracks: page_view, cta_click, section_view (via .tab button clicks)

**smartbrief-patient.html** — analytics `<script>` block added before `</body>`:
- Tracks: page_view, cta_click

**All three analytics scripts:**
- Silently disabled if `ANALYTICS_ENDPOINT` contains `YOUR_GOOGLE` or is empty
- Silently disabled on `file:` and `content:` protocols (Android Chrome local file)
- Non-blocking: `navigator.sendBeacon()` with `fetch()` fallback
- All code wrapped in try-catch — zero impact on existing functionality if any error occurs
- No external libraries, no visual changes, no modifications to existing HTML/CSS/JS
- Random session_id stored in `sessionStorage` (cleared on tab close, never sent to external servers)

---

### Nothing else was modified

No existing CSS, JavaScript, HTML structure, class names, IDs, inline styles, font links, animation logic, setTimeout patterns, or layout was changed in any file. All changes are purely additive.
