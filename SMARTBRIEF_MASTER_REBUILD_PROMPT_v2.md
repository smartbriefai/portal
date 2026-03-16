# SmartBrief AI — Master Rebuild Prompt v2
### Paste this entire prompt into a new Claude chat or Claude Code session.
### Produces all 3 working files with zero errors, zero rework.
### Last updated: March 2026

---

## CONTEXT & RULES FOR CLAUDE

You are building **SmartBrief AI** — pre-consultation intelligence SaaS for Indian specialty OPDs (Dental, ENT, Gynaecology, General Medicine). The founder has zero coding knowledge. Every file must work on first download in Android Chrome via `content://downloads/...` (local file protocol) AND on GitHub Pages.

**Non-negotiable technical rules:**
- Every file is a single self-contained `.html` file — no external JS/CSS files
- `html` and `body` must always have `overflow-x:hidden` and `max-width:100%`
- No 3-column grids on mobile (`max-width:768px`) — max 2-col on mobile
- Zero API keys or hardcoded credentials in any file
- All JavaScript must pass `node --check` with zero errors
- Demo data only — label everything DEMO, medical disclaimer on every page
- Font CDN: **Bunny Fonts only** (`fonts.bunny.net`) — Google Fonts is blocked on Android local files

---

## DESIGN SYSTEM (identical across all 3 files)

```css
/* CSS Variables */
--bg:#FAFBFF; --bg2:#F0F4FF; --bg3:#E8EEF8; --sf:#FFF;
--tx:#0F1F3D; --tx2:#4A5E80; --tx3:#8A9BBF;
--bd:#DDE3F0; --bd2:#C8D2E8;
--sh:0 2px 12px rgba(15,31,61,.07);
--sh2:0 4px 28px rgba(15,31,61,.11);
--r:12px;
/* Specialty accent — updated via JS */
--sp:#00897B; --ss:#E0F2F0; --sb:#80CBC4;
/* Font stacks — NO Arial, NO Helvetica, NO Google Fonts */
--fh:'Outfit','Google Sans Display','Google Sans','Product Sans','Roboto','Segoe UI',sans-serif;
--fb:'Inter','Google Sans','Roboto','Segoe UI',sans-serif;
```

```css
/* FONT LOADING — Bunny Fonts only (works on local files AND GitHub Pages) */
@import url('https://fonts.bunny.net/css?family=outfit:400;500;600;700;800|inter:400;500;600&display=swap');
```

```css
/* FONT OVERRIDE — prevents Arial Black fallback on any Android OEM */
h1,h2,h3,h4,.syne,[class*="title"],[class*="heading"]{
  font-family:'Outfit','Google Sans Display','Google Sans','Product Sans','Roboto','Segoe UI',sans-serif!important;
  font-weight:800!important; font-stretch:normal!important;
  -webkit-font-smoothing:antialiased;
}
```

**Specialty colour map:**
| Key | Emoji | Name | `--sp` | `--ss` | `--sb` |
|-----|-------|------|--------|--------|--------|
| `den` | 🦷 | Dental OPD | `#00897B` | `#E0F2F0` | `#80CBC4` |
| `ent` | 👂 | ENT OPD | `#1565C0` | `#E3F0FF` | `#90CAF9` |
| `gyn` | 🌸 | Gynaecology OPD | `#C2185B` | `#FCE4EC` | `#F48FB1` |
| `gen` | 🩺 | General Medicine OPD | `#2E7D32` | `#E8F5E9` | `#A5D6A7` |

**Logo SVG** (36×36 viewBox — use unique gradient IDs per file: `lg1/lg2`, `slg1/slg2`, `plg/ppg`):
```html
<svg width="30" height="30" viewBox="0 0 36 36" fill="none">
  <rect width="36" height="36" rx="9" fill="url(#lg1)"/>
  <rect x="9" y="6" width="14" height="19" rx="2"
    fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <path d="M12 11h8M12 14.5h8M12 18h5"
    stroke="rgba(255,255,255,0.45)" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M5 23L9 23L11.5 18L15 27L18 15L21 24.5L23.5 23L30 23"
    stroke="url(#lg2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="30" cy="23" r="2.5" fill="#00d4aa"/>
  <defs>
    <linearGradient id="lg1" x1="0" y1="0" x2="36" y2="36">
      <stop offset="0%" stop-color="#0d1f40"/>
      <stop offset="100%" stop-color="#0a2655"/>
    </linearGradient>
    <linearGradient id="lg2" x1="5" y1="23" x2="30" y2="23">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#00d4aa"/>
    </linearGradient>
  </defs>
</svg>
```

---

## AI ENGINE (Dashboard only)

```javascript
// Hugging Face — Qwen2.5-72B-Instruct via Sambanova
// Free with a free HF token (hf_...) from huggingface.co/settings/tokens
// Apache 2.0 license · No per-call cost within free monthly quota

const HF_MODEL    = 'Qwen/Qwen2.5-72B-Instruct';
const HF_PROVIDER = 'sambanova';
const HF_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions';

let hfToken = localStorage.getItem('sb_hftoken') || '';

async function callAI(prompt, onChunk, onDone, onError) {
  if (!hfToken) { onDone('__DEMO__'); return; }
  try {
    const resp = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + hfToken
      },
      body: JSON.stringify({
        model: HF_MODEL, provider: HF_PROVIDER,
        max_tokens: 900, stream: true, temperature: 0.3,
        messages: [
          { role: 'system', content: 'You are a clinical decision support assistant for Indian OPD doctors. Be concise, accurate, clinically relevant. Format responses with section headers in CAPS.' },
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!resp.ok) { const j=await resp.json().catch(()=>({})); throw new Error(j.error?.message||'API error '+resp.status); }
    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      buf += dec.decode(value, {stream:true});
      const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;
        try { const t = JSON.parse(data).choices?.[0]?.delta?.content||''; if(t) onChunk(t); } catch(_){}
      }
    }
    onDone('');
  } catch(e) { onError(e.message); }
}
```

**3 AI Features — all work in demo mode (no token needed):**

1. **🤖 AI Brief Generator** — Reception types complaint → Qwen 72B generates structured clinical brief (allergy flag, complaint summary, recommended actions). Streams character-by-character. "Add to Queue" button adds AI patient to OPD queue.

2. **⚗️ Drug Safety Checker** — Enter drugs comma-separated → AI returns colour-coded safety cards (✅ Green / ⚠️ Yellow / ⛔ Red). Quick-fill buttons: Aspirin+Warfarin, Dental trio, DM+HTN combo, Cardiac 4-drug.

3. **🎙️ Voice → Clinical Note** — Web Speech API (free, browser built-in) captures doctor's speech → AI structures into SOAP / Consultation Summary / Progress / Discharge note. Falls back to typed input.

**Demo mode fallbacks** (when no HF token — fully realistic specialty-specific responses for all 4 specialties in `DEMO_BRIEFS`, `DEMO_DRUG`, `DEMO_SOAP` objects).

**Token entry:** Inline `hf_...` input in each AI tab + Settings modal. Stored in `localStorage('sb_hftoken')`. Validated with `startsWith('hf_')`. Activates live AI across all 3 features simultaneously via `refreshKeyStatus()`.

---

## DEMO PATIENT DATA

```javascript
const SP = {
  den:{c:'#00897B',s:'#E0F2F0',b:'#80CBC4',i:'🦷',n:'Dental OPD',ch:'Dental',
    p:[
      {id:'p1',t:'T1',nm:'Mr. Ramesh K.',sb:'Old prescription uploaded',st:'ready',
       al:'Penicillin allergy — avoid penicillin-based antibiotics',
       cc:'Lower molar pain (L) × 3 weeks. Cold sensitivity.',
       h:'RCT UR6 — 2021. Regular scaling. No systemic conditions.',
       mx:'None currently.',
       ac:['Periapical X-ray (LL6)','Pulp vitality test','Cold test','Review uploaded prescription']},
      {id:'p2',t:'T2',nm:'Mrs. Shanthi R.',sb:'Walk-in, complaint entered',st:'next',
       al:'',cc:'Gum bleeding upper front teeth × 2 weeks. Sensitivity.',
       h:'No prior dental treatment. No systemic conditions.',mx:'None.',
       ac:['Oral hygiene assessment','Probing depth chart','OHI counselling']},
      {id:'p3',t:'T3',nm:'Mr. Vinod A.',sb:'Walk-in, waiting',st:'wait',
       al:'',cc:'Broken tooth upper right.',h:'No records available.',mx:'None.',
       ac:['Clinical examination','OPG if indicated']}
    ]},
  ent:{c:'#1565C0',s:'#E3F0FF',b:'#90CAF9',i:'👂',n:'ENT OPD',ch:'ENT',
    p:[
      {id:'p1',t:'T1',nm:'Mr. Arjun S.',sb:'Audiometry report uploaded',st:'ready',
       al:'Aspirin sensitivity — check analgesic choice',
       cc:'Bilateral hearing loss, progressive × 6 months. Tinnitus.',
       h:'Audiometry — 2024. No prior surgery.',mx:'None.',
       ac:['Weber test','Rinne test','Review uploaded audiogram','PTA interpretation']},
      {id:'p2',t:'T2',nm:'Mrs. Priya M.',sb:'Walk-in, ear pain',st:'next',
       al:'',cc:'Right ear pain × 2 days. Discharge.',
       h:'No prior ENT history.',mx:'None.',
       ac:['Otoscopy','Tuning fork tests','Swab if discharge']},
      {id:'p3',t:'T3',nm:'Master Kiran K.',sb:'Walk-in, paediatric',st:'wait',
       al:'',cc:'Recurrent tonsillitis × 4 episodes this year.',
       h:'No surgery. Last antibiotic 3 weeks ago.',mx:'Amoxicillin (last course).',
       ac:['Throat examination','Tonsil grading','Referral if Grade 3+']}
    ]},
  gyn:{c:'#C2185B',s:'#FCE4EC',b:'#F48FB1',i:'🌸',n:'Gynaecology OPD',ch:'Gynae',
    p:[
      {id:'p1',t:'T1',nm:'Mrs. Kavitha N.',sb:'Blood report uploaded',st:'ready',
       al:'G2P1 · Previous LSCS · GDM flag — monitor glucose',
       cc:'Antenatal 28 weeks. Swelling in feet. Fatigue.',
       h:'G2P1L1A0. Previous LSCS 2021. GDM controlled on diet.',
       mx:'Iron + Folic acid, Calcium.',
       ac:['BP + weight check','Fundal height measurement','Glucose review','Growth scan if due']},
      {id:'p2',t:'T2',nm:'Mrs. Lakshmi R.',sb:'Walk-in, irregular cycle',st:'next',
       al:'',cc:'Irregular periods × 6 months. Weight gain. Acne.',
       h:'No prior gynaecology treatment. LMP 8 weeks ago.',mx:'None.',
       ac:['USS pelvis','TSH, LH, FSH, AMH panel','Weight + BMI record']},
      {id:'p3',t:'T3',nm:'Mrs. Deepa S.',sb:'Walk-in, antenatal 20wk',st:'wait',
       al:'',cc:'Antenatal 20 weeks. Routine visit.',
       h:'G1P0. No complications.',mx:'Iron + Folic acid.',
       ac:['Anomaly scan if not done','BP + weight','Haemoglobin check']}
    ]},
  gen:{c:'#2E7D32',s:'#E8F5E9',b:'#A5D6A7',i:'🩺',n:'General Medicine OPD',ch:'General',
    p:[
      {id:'p1',t:'T1',nm:'Mr. Senthil V.',sb:'Blood report (HbA1c 9.1%)',st:'ready',
       al:'HbA1c 9.1% — poorly controlled T2DM. Review medication.',
       cc:'T2DM + HTN follow-up. Fatigue. Occasional dizziness.',
       h:'T2DM 8 years. HTN 3 years. No renal issues.',
       mx:'Metformin 500mg BD, Amlodipine 5mg OD.',
       ac:['Review blood report','Check BP + HR','Medication compliance check','Foot examination']},
      {id:'p2',t:'T2',nm:'Mrs. Radha K.',sb:'Walk-in, BP check',st:'next',
       al:'',cc:'BP monitoring visit. No new complaints.',
       h:'HTN 2 years.',mx:'Telmisartan 40mg OD.',
       ac:['BP both arms','Weight check','Medication review']},
      {id:'p3',t:'T3',nm:'Mr. Prakash R.',sb:'Walk-in, fever',st:'wait',
       al:'',cc:'Fever × 3 days. Body aches. No cough.',
       h:'No significant past history.',mx:'Paracetamol (self-medicated).',
       ac:['Temperature check','CBC + CRP','Malaria card test','Dengue NS1 if indicated']}
    ]}
};
```

---

## FILE 1: `index.html` — Landing Page (~46KB)

13 sections in order:
1. Fixed nav (logo + specialty tabs + BETA pill + "Open App →" links to `smartbrief-dashboard.html`)
2. Hero (headline: "Every patient. Every token. **Prepared.**" — "Prepared" in `--sp` teal)
3. Stats strip (87% walk-in / 2 min avg / 50-150 patients/day / ₹0 setup)
4. Gap section ("Everyone solved the wrong problem" — 3 competitor weakness cards)
5. How It Works (4 steps: Upload → AI reads → Brief generated → Doctor prepared)
6. Who Uses It (3 role cards: Front Desk / Doctor / Clinic Owner)
7. Comparison table (SmartBrief vs Practo Ray vs HealthPlix vs Nuance DAX, 8 rows, mobile scrollable)
8. ROI Calculator (sliders: patients/day × working days × ₹18 = monthly value)
9. Pricing (monthly/annual toggle, 3 plans — see exact prices below)
10. Specialties (4 clickable cards that update accent colour)
11. Beta recruitment ("First 10 Chennai clinics — free for life. No fake testimonials.")
12. Trust strip (6 badges)
13. Footer (navy `#0F1F3D`, 3 columns)

**Pricing (exact — locked):**
- Starter: ₹999/mo · ₹799/mo annual
- Pro: ₹2,499/mo · ₹1,999/mo annual ← MOST POPULAR
- Clinic+: ₹4,999/mo · ₹3,999/mo annual

---

## FILE 2: `smartbrief-dashboard.html` — OPD Dashboard (~133KB)

**State variables:**
```javascript
let cs='den', cu='Doctor', sel=null, queue=[], timerOn=false, timerSec=0;
let timerInt=null, tokCounter=4, addMode='w', actLog=[], reminders=[];
let lastDoc='', rxDrugCount=2;
let recognition=null, voiceActive=false, isListening=false, vcFullTranscript='';
let hfToken = localStorage.getItem('sb_hftoken') || '';
```

**8 tabs (TAB_IDS):** `['queue','rx','referral','followup','report','aibrief','drugsafe','voice']`

**AI tab styling** — purple gradient badge:
```css
.ai-tab::after{content:'AI';position:absolute;top:2px;right:3px;font-size:.48rem;
  font-weight:800;background:linear-gradient(135deg,#7C3AED,#2563EB);color:#fff;
  padding:1px 4px;border-radius:4px;}
.ai-tab.active{color:#7C3AED;border-bottom-color:#7C3AED}
```

**All features:**
- Login screen (name input + 4-tile specialty picker)
- Desktop sidebar (248px) with nav links + specialty switcher + user info
- Sticky header (date, specialty, consult timer MM:SS, 📺 Display button, + Add Patient)
- Stats bar (4 cells: Today's patients / Briefs ready / In consult / Done today)
- Tab 1 (Queue & Brief): queue cards with status badges + patient brief panel with allergy box, vitals entry, checklist, doctor notes, action buttons
- Tab 2 (Rx Generator): prescription pad form → formatted text output → WhatsApp share
- Tab 3 (Referral/Certificate): referral letter form + medical certificate form → preview → share
- Tab 4 (Follow-up): WhatsApp reminder scheduler → reminder list with send buttons
- Tab 5 (Daily Report): OPD stats grid + patient table → export
- Tab 6 (🤖 AI Brief): reception types complaint → Qwen 72B generates brief → add to queue
- Tab 7 (⚗️ Drug Safety): drugs + allergies → colour-coded AI safety report
- Tab 8 (🎙️ Voice Notes): mic button + Web Speech API + AI structures into SOAP note
- Token Display: fullscreen TV mode showing current token number
- Add Patient modal: walk-in entry OR document upload (simulated 2s AI generation)
- API Settings modal: HF token input (placeholder `hf_...`)
- Mobile bottom nav (4 buttons: Queue / Add / Rx / Report)
- Keyboard shortcuts: N=new patient, Space=timer, Enter=complete, D=token display, Esc=close
- Activity log, toast notifications

---

## FILE 3: `smartbrief-patient.html` — Patient Brief View (~31KB)

- Specialty picker screen on load (same 4-tile layout)
- Sticky header (logo + specialty chip + date)
- Patient banner (avatar + name + token + meta)
- Allergy box: Red ⚠️ if flagged, Green ✅ if clear
- 2×2 info grid (Chief Complaint / Visit Type / Relevant History / Current Medications)
- Vitals entry 4-box grid (BP / Weight / Temp / SpO₂) — 2×2 on mobile
- Action checklist with Priority (orange) / Routine (grey) badges
- Doctor notes textarea
- Visit history accordion (previous visits)
- Lab request slip accordion (8 test checkboxes + additional instructions + Print)
- Medical disclaimer box
- Fixed bottom action bar: 💬 WhatsApp / ✓ Complete / 🖨 Print

---

## VALIDATION CHECKLIST (check all before delivering)

**All 3 files:**
- [ ] `node --check` on all script blocks = zero errors
- [ ] `@import url('https://fonts.bunny.net/...')` — Bunny Fonts ONLY
- [ ] No Google Fonts (`fonts.googleapis.com` absent)
- [ ] No jsDelivr (`jsdelivr` absent)
- [ ] No Arial or Helvetica in any font-family stack
- [ ] `html { overflow-x:hidden; max-width:100% }` present
- [ ] `body { overflow-x:hidden; width:100%; max-width:100% }` present
- [ ] Mobile `@media(max-width:768px)` with no 3-column grids
- [ ] File ends `</html>` (no truncation)
- [ ] Medical disclaimer and Beta disclaimer present

**Dashboard additional:**
- [ ] `HF_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'` present
- [ ] `HF_MODEL = 'Qwen/Qwen2.5-72B-Instruct'` present
- [ ] No `api.anthropic.com` anywhere
- [ ] No `sk-ant-api03` anywhere
- [ ] `hf_` token validation: `startsWith('hf_')`
- [ ] TAB_IDS has exactly 8 entries including `'aibrief','drugsafe','voice'`
- [ ] `DEMO_BRIEFS` object covers all 4 specialties (den/ent/gyn/gen)
- [ ] `DEMO_DRUG` and `DEMO_SOAP` demo fallbacks present
- [ ] Queue default tab active on load (not Report or AI tab)
- [ ] Login screen shown on page load; `#dashScreen` is `display:none` initially
- [ ] `refreshKeyStatus()` defined exactly once

---

## PRODUCT CONTEXT

- **Product:** SmartBrief AI — Pre-Consultation Intelligence for Indian Healthcare
- **GitHub:** `smartbriefai/NewTrial1` → branch `claude/build-smartbrief-ai-ZcAAG`
- **Live URL:** `https://smartbriefai.github.io/NewTrial1/`
- **Workflow:** Claude Chat = strategy/design → Claude Code = execution/commit/push
- **Target:** Indian OPD clinics — Dental, ENT, Gynaecology, General Medicine
- **Pilot:** First 10 Chennai clinics free for life
- **Moat vs Practo/HealthPlix/Nuance DAX:** Only product with pre-consultation AI brief, no EHR needed, WhatsApp-first, India pricing, HF open-source AI (no per-call cost)
- **Revenue path:** ₹999→₹2,499→₹4,999/month · 834 clinics = ₹1 Crore ARR at month 24
- **HF token onboarding:** Free at huggingface.co/settings/tokens → New Token → Read → Copy → paste in AI Settings

---

## CLAUDE CODE INSTRUCTIONS

When using this prompt in Claude Code, place this as `CLAUDE.md` in the repo root:

```markdown
# SmartBrief AI — CLAUDE.md

## Repo context
- Repo: smartbriefai/NewTrial1
- Branch: claude/build-smartbrief-ai-ZcAAG
- Live: https://smartbriefai.github.io/NewTrial1/

## Files
- index.html — landing page
- smartbrief-dashboard.html — clinic OPD dashboard  
- smartbrief-patient.html — patient brief view

## Non-negotiable rules
1. Single self-contained HTML files — no separate JS/CSS
2. html + body: overflow-x:hidden, max-width:100%
3. No 3-column grids on mobile (max-width:768px)
4. Bunny Fonts ONLY — no Google Fonts, no jsDelivr
5. No Arial or Helvetica in font-family stacks
6. No api.anthropic.com — AI uses router.huggingface.co
7. No hardcoded tokens/keys — hfToken from localStorage only
8. After every change: node --check all script blocks before committing

## Design tokens
--bg:#FAFBFF --tx:#0F1F3D --sp:#00897B (changes per specialty)
Fonts: Outfit (headings 800) + Inter (body) via bunny.net
Specialties: Dental #00897B / ENT #1565C0 / Gynae #C2185B / General #2E7D32

## AI engine
Model: Qwen/Qwen2.5-72B-Instruct via Sambanova
Endpoint: https://router.huggingface.co/v1/chat/completions
Token: hfToken from localStorage('sb_hftoken'), validated with startsWith('hf_')
Demo mode: activate when hfToken is empty — use DEMO_BRIEFS/DEMO_DRUG/DEMO_SOAP fallbacks
```

*End of prompt. Paste everything above to rebuild all 3 files correctly.*
