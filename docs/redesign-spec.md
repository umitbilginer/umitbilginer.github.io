# umitbilginer.github.io — design specification

**This is the design the site actually ships.** Status: built and live on `main`.

Two earlier directions were designed and rejected by the site owner. Neither is
described here on purpose: an abandoned spec left in a repo is a trap, because the
next person to read it rebuilds the thing that was already thrown away. If you are
extending this site, build from this document only.

---

## Direction — "Colour field"

Three adjectives: **sovereign, chromatic, unhurried.**

One deep, saturated colour owns the whole screen. Very large display type at a *light*
weight floats in it; the contrast between enormous size and thin strokes is the whole
idea. Few elements, each given room. The restraint is the statement.

Chosen by the owner from four competing hero auditions. The audition file is preserved
at `docs/hero-audition-d.html` for reference — the shipped hero matches it except for
two deliberate changes noted under *Divergences*.

## Colour

| Token | Value | Role |
|---|---|---|
| `--field` | `oklch(0.34 0.072 195)` ≈ `#0D3D3F` | The field. Owns every screen. |
| `--field-hi` / `--field-lo` | `oklch(0.365 0.070 194)` / `oklch(0.305 0.074 197)` | The single on-tone gradient, top to bottom |
| `--ink` | `oklch(0.96 0.015 195)` ≈ `#E9F5F4` | Primary text — 10.7:1 |
| `--dim` | `oklch(0.79 0.05 190)` ≈ `#9CCFCA` | Secondary text — 6.9:1 |
| `--hairline` | `rgba(233,245,244,0.22)` | Rules. The only structural device besides whitespace. |

No second hue. No dark/light toggle. No shadows. Radius 0 everywhere. If a new element
needs a colour that is not here, it does not need a colour.

## Type

- **Archivo** 200/300 — display and poster numerals. Self-hosted WOFF2, latin + latin-ext.
- **Instrument Sans** 400/500 — all body and interface text. Self-hosted, same subsets.

Two families, nothing else. Latin-ext subsets carry ğ İ Ş for Turkish proper nouns;
ı ü ñ live in the latin subset. Both must keep loading for "Türkiye", "Peñagaricano",
"Günaydın Hayvancılık", "Pırlak".

## Borrowed, once

From a rejected direction ("two-ink press"), exactly one thing: **poster-scale numerals**
for metrics and section numbers. Scale only — same hue, same fonts, no second ink,
no halftone, no condensed display face.

## Density and motion

Very loose. 8px spacing scale. Section rhythm varies through scale and emptiness, never
through new colour or new type.

Motion: **one measured entrance on load, then stillness.** Opacity and transform only —
never layout-shifting properties. Every animation, including `scroll-behavior: smooth`,
is declared inside `@media (prefers-reduced-motion: no-preference)`.

## Structure

`index.html`: hero → 01 metrics → 02 story → 03 research → 04 publications →
05 journey → 06 talks & recognition → 07 outreach → 08 contact.
`cv.html`: same system, single column, print stylesheet, no JavaScript.

Publications sit above the timeline: the academic visitor's destination should not be
below a biographical scroll, and the recruiter has what they need by section 01.

## Content rules — these encode owner decisions, do not reverse them

1. **The hero headline is "Shepherd, then geneticist."** It is the strongest sentence he
   owns; it does positioning, memorability and differentiation at once.
2. **Methane genetics leads the research section.** It is his PhD thesis and the thing
   both audiences care about.
3. **Do not feature the Anatolian goat GWAS.** An earlier design made a Manhattan plot of
   its significant SNPs the visual centrepiece; the owner objected, correctly — that paper
   is neither his first-author work nor his thesis, and leading with gene names
   misrepresents his career. It is one row in the publication ledger. **Gene names must
   not appear in the hero, in headings, or as decoration.** They are legitimate only
   inside verified publication titles.
4. **The ≈30% methane figure is his own**, from his poster "Less Gas, Same Glass". State it
   in the first person and attribute it to his work. Never dress it as a journal citation.
5. **No Select & Sustain episode embeds.** The five shorts were removed after copyright
   takedowns. Channel links only.
6. **No CV PDF exists.** Link to `cv.html`. Never ship a dead download link.

## Data

`data/publications.json` is the source of truth for all 22 papers and has been
independently audited field-by-field against the pre-redesign site. Do not retype
bibliographic data; add papers by appending to the JSON.

Known gap: the per-paper citation counts sum to 130 while the headline figure is
Google Scholar's 156. Scholar totals legitimately exceed the visible sum, but the 156 is
hard-coded in six places (`index.html` ×4 including JS strings, `cv.html`,
`data/profile.json`) — reconcile them together, and re-check against Scholar when you do.

`cv.html` is static HTML. `data/cv.json` currently duplicates its education/positions/
talks/awards and is consumed by nothing. Adding paper #23 means editing the JSON and
`cv.html` by hand — worth wiring up properly before the list grows further.

## Budget and accessibility

First load 164 KB across 8 requests. Hard cap 600 KB — the pre-redesign site shipped
~37 MB of PNGs and that must never recur.

WCAG AA throughout (ink 10.7:1, dim 6.9:1). Semantic HTML, skip link, visible focus rings,
`aria-pressed` on filter pills, mobile nav that traps focus and restores it on close.
`cv.html` carries `class="no-js"` on `<html>` so its navigation stays visible without
JavaScript — it loads none.
