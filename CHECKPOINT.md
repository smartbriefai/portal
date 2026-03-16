# SmartBrief AI — Checkpoint 1 / Version 1

## State
All 3 HTML files working cleanly.
- index.html — Landing page, 13 sections, ROI calculator, pricing
- smartbrief-dashboard.html — Full OPD dashboard, 8 tabs, dark mode,
  3 AI features (AI Brief, Drug Safety, Voice Notes) via Vercel proxy
- smartbrief-patient.html — Patient brief view, specialty picker

## Features live
- 4 specialties (Dental, ENT, Gynaecology, General Medicine)
- AI Brief Generator, Drug Safety Checker, Voice → Clinical Note
- Dark mode with page-turn animation
- Sidebar nav highlighting
- Live AI status with blinking green indicator
- Medical disclaimer on AI outputs
- Token Display (TV/tablet fullscreen mode)
- Follow-up WhatsApp reminders
- Rx Generator, Referral Letter, Medical Certificate
- Daily OPD Report

## Infrastructure
- GitHub Pages: smartbriefai.github.io/portal
- Vercel proxy: api/chat.js (HF token via SMB1 GitHub secret)
- Branch: claude/build-smartbrief-ai-ZcAAG

## To restore this checkpoint
```
git checkout checkpoint-1-v1
# or to restore specific files:
git checkout checkpoint-1-v1 -- smartbrief-dashboard.html
git checkout checkpoint-1-v1 -- index.html
git checkout checkpoint-1-v1 -- smartbrief-patient.html
```

## Git tag
`checkpoint-1-v1`
