# AI Safety Boundaries

Internal reference. Not linked from any public page. This is a seed document
for future evaluation and review work, not a public claim or marketing copy.

SmartBrief AI is a pre-consultation support tool for OPD clinics. Its AI
features (patient brief generation, Rx suggestions, drug safety checks, and
voice-to-note) are assistive only. A qualified doctor stays fully in control
of every clinical decision.

## What the system does not do

- It does not provide a diagnosis. Any summary or brief it produces is a
  starting point for the treating doctor, not a diagnostic conclusion.
- It does not prescribe. AI Rx output is a draft suggestion that the doctor
  must review, edit, and sign before anything is dispensed to a patient.
- It does not suggest or approve medication without doctor review. No AI
  output is intended to reach a patient unchanged.
- It does not replace the drug interaction judgement of a doctor or
  pharmacist. The drug safety check is an automated pass over the drug
  database and must be confirmed against patient history and current
  clinical guidelines.
- It does not handle emergencies or red-flag symptoms. It is not built for
  triage, acute care, or any time-critical situation, and must not be relied
  on for them.
- It does not make treatment decisions, set dosages as final, or authorise
  any care pathway on its own.
- It does not offer legal, insurance, or billing advice.
- It does not store patient briefs in a long-term database. Briefs are
  processed for the session only (see the public Privacy and Data page for
  the patient-facing summary).

## What the system is for

- Preparing a structured view of patient intake before the consultation.
- Drafting suggestions a doctor can accept, edit, or discard.
- Surfacing possible drug interactions for the doctor to confirm.
- Turning dictated findings into a structured note the doctor reviews.

## Intended use boundary

Every AI feature assumes a qualified clinician is present, reviewing output,
and making the final call. SmartBrief AI is a support layer around that
clinician, never a substitute for them.

## Open items for future evaluation work

- Define test cases for red-flag and emergency inputs to confirm the system
  defers rather than advises.
- Define review criteria for Rx suggestions (accuracy, safety, doctor
  edit rate).
- Define expected behaviour when patient history or allergy data is missing.
- Track how often the drug safety check disagrees with a pharmacist review.
