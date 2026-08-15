# umitbilginer.github.io — Redesign Specification

Status: approved by site owner. Build from this document.

---

## 1. Concept — "The Field and the Genome"

A light, paper-cream, editorial-scientific document — closer to a beautifully typeset
monograph than a tech portfolio — whose single decorative gesture is **his own published
data**. The palette is the landscape he herded sheep in (cream limestone, pine green, dry
soil); the typography is oversized serif display against workmanlike sans; the story is told
in one line at the top — *shepherd, then geneticist* — and immediately backed by numbers a
recruiter absorbs in ten seconds and a publication ledger a professor can filter in five.

The page opens and closes with **deep pine-green ink bands** (hero backdrop, footer), cream
paper between. This gives the drama of a dark site at the two moments that matter without
the template smell of a full dark theme.

Everything that currently reads "AI template" is deleted: the dark glow, the DNA helix
canvas, the emoji favicon, the hover-lift cards, the animated stat counters, and all 37 MB
of generated PNGs.

**Audience:** industry + academia, mixed. An ABS/Genus/Cobb recruiter must grasp what he
does in 20 seconds; a professor must find publications and methodology fast.

---

## 2. Palette

Light site. **No dark mode** (`color-scheme: only light`).

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F4EFE3` | Page background (warm cream, limestone) |
| `--paper-raised` | `#FBF8F0` | Cards, filter pills, ledger row hover |
| `--paper-sunken` | `#EAE3D2` | Hairline fills, video facades, code chips |
| `--ink` | `#20261E` | Primary text — 13.4:1 on `--paper` |
| `--ink-soft` | `#4E564A` | Secondary text, captions — 7.0:1 |
| `--pine` | `#2C5E42` | Brand green: links, active states, rules — 6.2:1 |
| `--pine-deep` | `#16301F` | Hero band, footer band |
| `--pine-band-text` | `#EFE9DA` | Text on pine bands — 12.6:1 |
| `--soil` | `#7A5230` | Timeline spine, pull-quote rules — 5.6:1 |
| `--rust` | `#B4451B` | Significance marker: significant SNPs, badges, ↗ |
| `--rust-text` | `#9A3A16` | Rust when used as text — 5.4:1 |
| `--ochre` | `#C99B3F` | Graphic only: threshold line, award marks. Never body text |
| `--line` | `#D8CFBA` | Hairlines, 1px borders |
| `--focus` | `#2C5E42` | 2px outline, 2px offset, all focusables |

Rules: rust appears at most once per viewport-height of scroll — it means *significance*,
and overuse destroys the metaphor. Pine is the only link colour. No gradients, except an
optional ≤1 KB inline `<feTurbulence>` paper-grain at 2% opacity.

---

## 3. Typography

All Google Fonts, self-hosted WOFF2 in `/fonts/`, subset latin + latin-ext (must render
Ü, ı, ğ, ş, ñ — verify "Türkiye" and "Peñagaricano"). Budget ≤190 KB.

- **Display — `Fraunces`** (variable: wght 400–700, opsz 9–144, SOFT, WONK). The signature.
  Hero words use high `opsz` and `"WONK" 1`; the slightly wonky old-style forms read
  handmade and rooted while staying a serious serif. Headings at weight 560–620.
- **Text & UI — `Instrument Sans`** (variable wght 400–700). Body 400, labels 500,
  emphasis 600.
- **Data & annotation — `IBM Plex Mono`** (400, 500). Chromosome labels, dates, DOIs, stat
  captions, skill lines, section kickers. The "instrument readout" voice.

| Token | Size | Style |
|---|---|---|
| `--t-hero` | `clamp(3.4rem, 11vw, 8.5rem)` | Fraunces 600, opsz 144, WONK 1, lh 0.95, ls −0.015em |
| `--t-h1` | `clamp(2.4rem, 5.5vw, 4rem)` | Fraunces 580, lh 1.05 |
| `--t-h2` | `clamp(1.7rem, 3.5vw, 2.5rem)` | Fraunces 560, lh 1.15 |
| `--t-h3` | `1.25rem` | Instrument Sans 600, lh 1.3 |
| `--t-lead` | `clamp(1.125rem, 1.8vw, 1.375rem)` | Fraunces 430 italic, lh 1.55 |
| `--t-body` | `1.0625rem` | Instrument Sans 400, lh 1.65, max 68ch |
| `--t-small` | `0.875rem` | Instrument Sans 400/500, lh 1.5 |
| `--t-mono` | `0.8125rem` | IBM Plex Mono 400, ls 0.02em |
| `--t-label` | `0.75rem` | IBM Plex Mono 500, uppercase, ls 0.14em |

Section headers carry a numbered mono kicker (`01 — STORY`) above the Fraunces heading.
That numbering + wonky Fraunces + the mono annotation voice is where the signature lives.

---

## 4. The signature motif — a real signal map

The hero's lower third is an **inline-SVG signal map** built from published data.

**Critical constraint: no synthetic data anywhere.** The full GWAS summary statistics are
not available, so a full Manhattan plot cannot be drawn honestly. Instead we draw *only the
genome-wide significant SNPs* — every mark on the graphic is a real, published, citable
finding. No simulated background scatter. If the raw summary statistics later become
available from the coauthors, the background field can be added without redesigning.

**Data — `data/signals.json`.** From Table 2 of Demir, Bilginer et al., *Mammalian Genome*
37:30 (2026), doi:10.1007/s00335-026-10203-w — all 10 SNPs exceeding the genome-wide (FDR)
threshold:

| Chr | Position (bp) | Nearest gene | −log₁₀(p) | Trait | Breed |
|---|---|---|---|---|---|
| 19 | 50,800,531 | SLC38A10 | 9.86 | 90-LW | KBK |
| 1 | 108,225,908 | MFSD1 | 8.20 | 90-LW | HAI |
| 18 | 43,790,753 | ZNF507 | 8.04 | 90-LW | KBK |
| 13 | 62,917,233 | RALY | 8.02 | 90-LW | KBK |
| 2 | 1,651,769 | IGSF21 | 7.89 | 90-LW | KBK |
| 2 | 75,366,873 | CXCR4 | 7.20 | LMY | HNM |
| 23 | 12,380,234 | ID4 | 7.05 | BW | HNM |
| 14 | 1,407,910 | CHMP4C | 7.03 | 90-LW | HAI |
| 20 | 9,682,050 | MAP1B | 7.01 | 90-LW | HAI |
| 28 | 42,830,428 | PGBD5 | 7.00 | 90-LW | KBK |

Study context for captions: 309,342 bi-allelic SNPs, 481 animals, three Anatolian goat
breeds (Hair, Honamlı, Kabakulak); traits birth weight, 90-day live weight, lactation milk
yield; suggestive threshold −log₁₀(p) = 5, genome-wide threshold ≈ 7.3 (FDR).

**Rendering.** Genome-fraction x-positions computed from the public *Capra hircus* ARS1.2
autosome lengths (chromosomes 1–29) — verify these against Ensembl at build time and store
them in `data/genome.json` so the maths is reproducible and auditable. Baseline with 29
chromosome ticks in `--t-mono`; each SNP is a thin `--rust` stem rising to its −log₁₀(p)
value with a filled cap; an `--ochre` dashed line marks the genome-wide threshold; gene
names sit at the stem tops in mono, angled or staggered to avoid collision. A 3px `--paper`
horizon rule closes the band — the plot literally sits on the horizon between the pine sky
and the cream page.

**Caption (non-negotiable, visible, on paper below the band):**
`Genome-wide significant SNPs — Demir, Bilginer et al., Mammalian Genome 37:30 (2026)`
linked to the DOI. An unlabelled plot is decoration; a cited plot is evidence.

SVG `viewBox="0 0 1440 300"`, `aria-hidden="true"` with the visible caption serving as the
text alternative. No canvas: SVG is crisp at any DPI and styleable by CSS variables.

**The motif as a system, not a one-off:**
1. **Section dividers** — a 24 px SNP-tick band derived from the same signal positions,
   used at most twice (above Publications, above Outreach). Replaces the deleted PNG
   dividers.
2. **Favicon + nav mark** — 24×24 SVG: three rust stems rising above an ochre dashed line.
   Replaces the 🧬 emoji. Also the OG image centrepiece.
3. **Footer** — the same skyline, mirrored and small (60 px), on the band's top edge.

---

## 5. Layout, grid, motion

- **Grid:** 12 fluid columns, `max-width: 1200px`, gutter 24 px, page padding
  `clamp(20px, 5vw, 64px)`. Body text caps at 68ch. Narrative sections use cols 2–8 for text
  and 9–12 for marginalia — systematic asymmetry, never centre-everything.
- **Spacing scale (8 px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section padding
  `clamp(64px, 10vw, 128px)`.
- **Breakpoints:** 480 / 768 / 1024 / 1440.
- **Nav:** static top bar (not fixed-glassmorphic): mark + name left; Story, Research,
  Publications, Outreach, CV right, in mono `--t-small`. Mobile: real
  `<button aria-expanded>` opening a full-screen paper panel. Skip-link first in DOM.

**Motion — one entrance, then stillness.** Moving data is suspicious; still data is evidence.

- Hero signal stems draw upward with a per-stem stagger, 900 ms total, once on load.
- Section H2s: 24 px translate-up + fade on first intersection, 500 ms,
  `cubic-bezier(0.16,1,0.3,1)`, once. Content blocks do **not** individually stagger.
- Hover: links get a 2 px pine underline growing left→right (150 ms); publication rows shift
  to `--paper-raised` with the ↗ turning rust. No translateY lifts, no glows, no shadows.
- **Deleted forever:** stat counters, DNA canvas, hero glow keyframes, scroll-pulse
  indicator, smooth-scroll JS (use CSS `scroll-behavior` + `scroll-margin-top`).
- Every animation is declared *inside* `@media (prefers-reduced-motion: no-preference)`.
  The current `0.01ms !important` override is a bug — it leaves reveal elements invisible.
  It dies with the rewrite.

---

## 6. Sections

Order: 1 Hero · 2 Proof strip · 3 Story · 4 Research · 5 Publications · 6 Journey ·
7 Talks & Recognition · 8 Select & Sustain · 9 Toolbox · 10 Contact/footer.

Publications sit **above** the timeline: the professor's first destination should not be
below a biographical scroll, and the recruiter already has everything by section 2.

### 6.1 Hero (pine-deep band)

```
┌──────────────────────────────────────────────────────────────┐
│ ▲▲▲ Ümit Bilginer      Story Research Publications CV        │
│                                                              │
│  QUANTITATIVE GENETICS · UW–MADISON            (mono kicker) │
│                                                              │
│  From herding sheep                                          │
│  to breeding better ones                                     │
│  — with genomics.                          ("genomics" ochre)│
│                                                              │
│  PhD student with Francisco Peñagaricano. Genomic selection  │
│  and GWAS for methane emissions in dairy cattle; population  │
│  genomics of native Anatolian breeds.                        │
│                                                              │
│  [ See publications ]   [ Read CV ]                          │
│                                                              │
│   SLC38A10                                                   │
│      ╽    MFSD1  ZNF507 RALY                                 │
│      ┃      ╽      ╽     ╽   IGSF21  CXCR4  ID4  CHMP4C      │
│ - - -┃- - - ┃- - - ┃- - -┃- - -╽- - - -╽- - -╽- - -╽- - (ochre)
│      ┃      ┃      ┃     ┃     ┃      ┃     ┃    ┃           │
│  1  2  3  4  5 ··············· 26  27  28  29    (mono)      │
│══════════════════════════════════════════════════════════════│
│  ↳ Genome-wide significant SNPs — Mamm. Genome 37:30 (2026)  │
└──────────────────────────────────────────────────────────────┘
```

~92 vh desktop; content-height on mobile with the signal map compressed to ~160 px and
alternate chromosome labels dropped. Gene labels must never collide — stagger vertically.

Recruiter test: name, field, institution, and the keywords *genomic selection, dairy cattle,
methane* above the fold. Academic test: advisor named in the first sentence, publications
one click away.

### 6.2 Proof strip (cream, under the horizon)

One hairline-separated row, Fraunces numerals + mono captions, **static — no counting
animation**: `22 / peer-reviewed papers`, `156 / citations`, `7 / h-index`,
`2 / industry internships — Cobb-Vantress · ABS Global`. That fourth cell is the highest-value
line for the industry audience and is currently buried in a timeline. Numbers come from
`data/profile.json` so a citation update is a one-line edit. Google Scholar link right-aligned.

### 6.3 Story (`02 — STORY`)

Text cols 2–8; photo cols 9–12 (re-encoded 640 px WebP ~55 KB + JPEG fallback, 2 px `--line`
border, `--paper-sunken` mat, mono caption beneath). Lead paragraph in Fraunces italic
`--t-lead`: the shepherd sentence, set like a pull quote — it is the best sentence he owns.
Then two short body paragraphs: farm → research-farm turning point → the institutional path
(Akdeniz → Aarhus → Michigan State → UW–Madison; Cobb-Vantress and ABS Global for industry).
Marginalia under the photo, mono `--ink-soft`:
`Cattle · Sheep · Goats · Chickens · Quail — the principles transfer.`
Delete the multi-species PNG and the interest-tag pills.

### 6.4 Research (`03 — RESEARCH`)

Not cards — a numbered **ledger**. Four full-width hairline-ruled rows: mono `R1`–`R4`,
Fraunces h3 title, one two-line sentence, mono keyword string right-aligned. Each row is an
`<a>` from day one so project pages can be added later.

- **R1 — Methane genetics in dairy cattle.** *This is the PhD thesis.* Whether an individual
  cow's methane output is heritable, and how to select on it without costing the farmer
  milk. `BLUPF90+ · ssGBLUP · US Holstein`
- **R2 — Genomic selection & prediction.** `GBLUP · Bayesian · cross-validation`
- **R3 — GWAS & QTL mapping.** From Anatolian goats to commercial poultry lines.
  `GEMMA · PLINK · GCTA`
- **R4 — Population genomics & conservation of native breeds.**
  `ddRADseq · ADMIXTURE · FST`

Delete the generic SVG icons — the ledger's typography is the visual.

### 6.5 Publications (`04 — PUBLICATIONS`) — JSON-driven

`data/publications.json`, one object per paper:

```json
{ "id": "bilginer2026-pirlak", "year": 2026,
  "authors": ["Bilginer, U.", "Demir, E.", "Gondro, C."],
  "self_index": 0, "first_author": true,
  "title": "Evaluation of ddRADseq data for SNP and InDel discovery in Pirlak sheep",
  "venue": "Small Ruminant Research", "detail": "107707",
  "doi": "", "url": "https://...", "citations": 2,
  "species": ["sheep"], "topics": ["popgen", "seq"], "type": "article" }
```

Rendered as a **ledger, not cards** — rows scan, cards do not at n = 22:

```
  04 — PUBLICATIONS                        22 papers · 156 citations · Scholar ↗
  ┌────────────────────────────────────────────────────────────────────────────┐
  │ (All 22)(First author)(Cattle)(Sheep)(Goat)(Poultry)                       │
  │ (GWAS & signatures)(Diversity & popgen)(Machine learning)(Reviews)         │
  ├──────┬───────────────────────────────────────────────────┬──────┬──────────┤
  │ 2026 │ Machine learning classification of dilated        │  🐔  │    ↗     │
  │ 1st  │ cardiomyopathy severity in commercial broilers    │      │          │
  │      │ Bilginer U, Fernandes AFA, Flack B, …             │      │          │
  │      │ Poultry Science · 107473                          │      │          │
  ├──────┼───────────────────────────────────────────────────┼──────┼──────────┤
  │ ···  │                                                   │      │          │
  └──────┴───────────────────────────────────────────────────┴──────┴──────────┘
                       [ Show all 22 ]      ← collapsed to 7 rows by default
```

Row anatomy: left rail (Fraunces year, shown once per year-group; rust mono `1st` chip when
first author), middle (title in Instrument 600 = the link; authors `--t-small` `--ink-soft`
with his own name at 600; venue italic + citation count in mono), right (16 px single-line
species glyph from an in-house five-icon set, and the ↗).

Filters are real `<button aria-pressed>` pills. **Year is not a filter dimension** — the year
rail already handles chronology. Species, topic and first-author are, because that is how a
professor actually reads this list. "First author" is its own pill because it answers the
committee's real question. Collapsed to 7 rows; any filter press expands fully. Mobile: rail
moves inline above the title, glyphs drop. Empty-filter state gets a mono one-liner, never a
blank void.

### 6.6 Journey (`05 — JOURNEY`)

Vertical timeline, 2 px `--soil` spine, no cards: mono date in a fixed 110 px column, then
Fraunces h3 + organisation + one line. **Industry** entries (ABS Global, Cobb-Vantress,
Günaydın Hayvancılık) get a soil-filled square on the spine and a mono `INDUSTRY` tag;
academic entries get an open circle.

The root of the spine, below the 2014 BSc, is a new entry in italic Fraunces:
`pre-2014 · Shepherd — family flock, rural Türkiye`. That single line turns the timeline from
CV filler into the narrative payoff.

### 6.7 Talks & Recognition (`06 — RECOGNITION`)

New section. Two mono-ruled sub-lists side by side, stacking on mobile.

*Talks*
- WCGALP 2026, Madison — "Genetic parameters of methane emissions traits in US Holstein
  cows." Poster C1-5 and pitch, July 2026.
  Proceedings: https://www.iastatedigitalpress.com/wcgalp/article/id/24220/
- 5th UW–Madison Dairy Symposium — methane emissions in US Holstein cows, in the session on
  stewarding land and water resources; with Francisco Peñagaricano and Afees Abiola Ajasa.
  Supported by the Dairy Innovation Hub. **Recording:**
  https://www.youtube.com/watch?v=6ocJvWbaxkg — embed as a click-to-load facade; a recorded
  talk is direct evidence of presentation skill.

*Recognition*
- 2nd place, UW–Madison Infographic Poster Competition, Animal & Dairy Sciences —
  "Less Gas, Same Glass." The finding behind it: roughly 30% of the variation in methane
  output is genetic.
- Erasmus+ visiting researcher grant, Aarhus University (2023).
- Add further awards/funding from the CV before launch. If fewer than three entries per
  column, fold the section into Journey rather than shipping a near-empty section.

### 6.8 Select & Sustain (`07 — OUTREACH`)

Label it **Science communication** so the industry audience reads it as a skill exhibit.
One framing sentence, then the featured episode plus a 4-up grid as **click-to-load
facades**: 9:16 `--paper-sunken` block, YouTube thumbnail
(`https://i.ytimg.com/vi/{id}/hqdefault.jpg`, `loading="lazy"`, ~20 KB each), pine play
triangle, mono episode label; the iframe is injected only on click, with button semantics and
`aria-label`. This removes ~2–3 MB of third-party payload from first load.

Episode IDs (unchanged): EP1 `V0yl0N9jJZE`, EP2 `uCmMqqnutas`, EP3 `GpOmy7ImSlo` (featured),
EP4 `T4bMO9374pc`, EP5 `q9bA-3g3gxA`.

Stats line in mono: `YouTube · Instagram @selectandsustain · 4,500+ on LinkedIn`.
Instagram: https://www.instagram.com/selectandsustain/

### 6.9 Toolbox (`08 — TOOLBOX`)

One compact block, three mono lines, no chips, no hover states:
`Genomics — R · BLUPF90+ · PLINK · GCTA · GEMMA · VCFtools · ADMIXTURE`
`Computing — Linux · Bash · HPC (CHTC)`
`Wet lab — ddRADseq library prep · GBS · PCR`
Languages move to the footer. This section exists to be grep-able by a recruiter; ~120 px
tall, done.

### 6.10 Contact + footer (pine-deep band, mirrored mini signal map on its top edge)

H2 in Fraunces cream: "Working on methane, breeding programs, or native breeds? Talk to me."
The email is the CTA, not an icon card: `bilginer@wisc.edu` set at `--t-h2`, cream,
underlined. Below, one mono row of **text** links — no icon tiles:

- Google Scholar — https://scholar.google.com/citations?user=y5osRVUAAAAJ
- ORCID — https://orcid.org/0000-0002-6217-5223
- LinkedIn — https://www.linkedin.com/in/%C3%BCmit-bilginer-a62706192/
- GitHub — https://github.com/umitbilginer
- ResearchGate — https://researchgate.net/profile/Umit-Bilginer
- YouTube — https://www.youtube.com/@selectandsustain

Footer line: `© 2026 Ümit Bilginer · Built with plain HTML — no trackers · English · Türkçe · Kurdî`

### 6.11 CV page

`/cv.html`: same header and footer, single 68ch column, rendered from `publications.json`
plus a new `data/cv.json` (education, positions, talks, awards). Print stylesheet
(`@media print`: black on white, bands removed, links expanded). **No PDF at launch** — the
owner is not supplying one. Leave the download slot out entirely rather than shipping a dead
link; the hero's second button reads "Read CV" and points to `/cv.html`.

---

## 7. Content updates to apply

**Metrics** (`data/profile.json`): 22 publications · 156 citations · h-index 7 · i10-index 6.
Superseding the site's current 20 / 131.

**Two publications missing from the site:**

1. **Bilginer, U.**, Fernandes, A. F. A., Flack, B., Anthony, N., & Likness, V. (2026).
   Machine learning classification of dilated cardiomyopathy severity in commercial broiler
   chickens. *Poultry Science*, 107473.
   https://www.sciencedirect.com/science/article/pii/S003257912601103X
   — First author, open access, from the Cobb-Vantress internship. Topics: `ml`, `poultry`.
   This is the strongest single card for the industry audience; make sure the ML topic filter
   surfaces it.
2. Appuhamy, R., Baldwin, R. L., **Bilginer, U.**, French, E. A., James, L., Kalscheur, K. F.,
   et al. (2026). Genetic parameters of methane emissions traits in US Holstein cows.
   *WCGALP 2026 Digital Archive*.
   https://www.iastatedigitalpress.com/wcgalp/article/id/24220/

**Correction:** the British Poultry Science paper is listed as "1–10" — the real citation is
*British Poultry Science* 67(2), 159–168.

**Citation counts to refresh** from Google Scholar
(https://scholar.google.com/citations?user=y5osRVUAAAAJ): Anatolian goats GWAS 2 ·
ddRADseq Pirlak 2 · Anatolian goats diversity 5 · British Poultry Science 1. Carry the rest
over from the existing HTML and reconcile the total to 156.

**Status changes — both currently shown as UPCOMING, both are finished:**
- **ABS Global** — Genetics & Genomics Intern, under Juan Nani, DeForest WI. Mid-May 2026 to
  **1 September 2026, completed.** Beef and dairy genetics projects.
- **WCGALP 2026** — took place in Madison, July 2026. Move to Talks; remove the UPCOMING
  banner from Research. There is no upcoming item to advertise; do not invent one.

**Current work:** methane genetics is the PhD thesis and is ongoing. Say so in R1 and in the
hero sentence.

---

## 8. Performance & assets

- **Delete every existing PNG**: `cowfarm.png`, `livestock-field.png`, `genomics-visual.png`,
  `research-atmosphere.png`, `multi-species.png`, `dna-art.png`, `methane-climate.png`,
  `og-preview.png`. ~37 MB → 0. The signal map and SNP bands replace every decorative role
  they served, with real data. (`dna-art.png` and `methane-climate.png` were already unused.)
- Keep and re-encode: profile photo → 640 px WebP ~55 KB + JPEG fallback; Select & Sustain
  logo → 200 px WebP ~15 KB.
- New OG image: 1200×630, pine band + name + signal skyline, exported once, ≤150 KB.
- **Budget:** HTML ~35 KB + CSS ~28 KB + JS ~12 KB + fonts ~190 KB + JSON ~10 KB + photo
  55 KB + logo 15 KB + 5 lazy thumbnails ~100 KB ≈ **~450 KB first load.** Hard cap 1.5 MB.
- JS is ~200 lines, no dependencies: fetch and render publications, render the signal map,
  filters, video facades, mobile nav. `<noscript>` fallback linking to Google Scholar.

---

## 9. Accessibility & SEO

- Semantic landmarks (`header`/`nav`/`main`/`section[aria-labelledby]`/`footer`), skip link,
  real `<button>`/`<a>` for every interactive element, visible `:focus-visible`
  (2 px pine outline, 2 px offset), `aria-pressed` on filter pills, `scroll-margin-top` on
  anchors.
- The signal map is `aria-hidden` with the visible caption as its text alternative.
- All pairs in §2 clear WCAG AA; body pairs clear AAA.
- `lang="en"` with `lang="tr"` spans on Turkish proper nouns.
- **Add JSON-LD** (`Person` + `ScholarlyArticle`) — currently missing and valuable for
  academic identity resolution. Include ORCID 0000-0002-6217-5223, affiliation
  University of Wisconsin–Madison, and `sameAs` for Scholar, ORCID, LinkedIn, GitHub,
  ResearchGate, YouTube.
- Keep the existing `google-site-verification` meta tag: `Tn6y78t5KicGuXKqPx3C9cRecqQwGbIEsZiwnHvBQXw`.
- Update `sitemap.xml` to include `/cv.html`; refresh `lastmod`.

---

## 10. Load-bearing decisions

1. **Real, cited, published SNP data as the sole visual motif** — it cannot be templated, it
   is proof of work, and the caption converts ornament into credential. No synthetic points,
   ever.
2. **Two pine-deep bands bracketing a cream body, no dark mode** — bold first and last
   impression, readable scholarly middle, half the QA surface.
3. **Publications as a filterable ledger above the timeline, driven by JSON** — this is the
   academic visit in its entirety, and the JSON is what keeps the site alive as papers 23,
   24, 25 arrive.
4. **The shepherd line as the hero headline** — one sentence does positioning, memorability
   and differentiation at once.
5. **Fraunces (wonky, oversized) + Plex Mono annotation voice** — the serif carries
   warmth and earth, the mono carries instrument-grade rigour; their collision *is* the
   shepherd→geneticist story told typographically.

## 11. Deliberately rejected

- Refining the existing dark + emerald theme — dark glow, helix and counters are the
  AI-template trifecta.
- Any generic DNA helix or particle system — decoration that claims no knowledge.
- A dark-mode toggle — cost without audience benefit; the identity is paper.
- Card grids with hover-lift and staggered reveals — the current site's core vice.
- Animated stat counters — they signal "template" and delay the very numbers they exist
  to show.
- A photographic hero (shepherd or farm imagery) — expected, costly in megabytes, and
  stock-or-AI farm imagery would undermine the authenticity the story depends on. The photo
  lives small and captioned in Story, where it reads as document rather than backdrop.
- Year filters on publications — redundant with the chronological rail.
- Keeping any of the 37 MB of PNGs, including the 6.5 MB image displayed at 12% opacity.
