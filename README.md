# Constellation

**An explainable knowledge atlas for the world's rare diseases** — built for the 7th Global AI Hackathon, Challenge 05: *AI Atlas for the World's Rare Diseases* (OpenAI × Buffalo Initiative × Hack-Nation).

> **Five thousand scattered points of light. One map to see the constellations.**

**Live demo:** [https://rare-disease-atlas.lovable.app](https://rare-disease-atlas.lovable.app)

---

## The premise: our first pediatricians

For most rare diseases, the first clinician a child ever sees is not a specialist. **It is a mother.** Parents and caregivers hold the longest, richest clinical record that exists for their child — every seizure, every milestone that came late, every test that came back "normal" — yet that record is scattered across discharge summaries, patient-portal messages, and memory. A family can wait **five to seven years** on the diagnostic odyssey while the pieces sit in different drawers, in different hospitals, described in different vocabularies.

Constellation is built for that first pediatrician — and for the scientists and advocates who can shorten the journey once the pieces are joined. Paste a note, and the atlas reads it the way a careful clinician would: symptoms become ontology codes locally in the browser, the patient's profile lights up on a starfield map of mechanistic disease biology, and every connection shown — to a gene, a shared pathway, a patient community, a study, a researcher, or a repurposing candidate — carries its source, its confidence, and its contradictions. When the evidence runs out, Constellation says so plainly and shows exactly which experiment would fill the gap.

The result is not a search engine. It is an **actionable map**: from a symptom to a mechanism, from a mechanism to a neighboring community already organized, from a question to the dossier that gets it funded.

---

## The 20×–30× multiplier matrix

Every module below is live in the deployed prototype and verified at desktop and mobile sizes.

| # | Multiplier | What it does | Where |
|---|---|---|---|
| 1 | **Zero-friction clinical note intake** | Paste an unstructured note or discharge summary; HPO-linked phenotypes are extracted **locally in the browser** (nothing leaves the device), plotted onto the starfield, and ranked against disease clusters with a transparent overlap score and explicit "not a diagnosis" framing. | *Mapping symptoms* section |
| 2 | **Starfield causal knowledge graph** | Interactive d3-force SVG atlas of diseases, genes, variants, mechanisms, phenotypes, studies, patient organizations, research assets, and researchers. Solid edges = observed evidence; dashed = inferred; amber "!" = contested. Pan, zoom, filter, click anything for cited evidence. | *Figure 01 / Mechanism map* |
| 3 | **Contradiction & scientific frontier radar** | Evidentiary conflicts (variant pathogenicity, trial endpoints, preprint-vs-peer-reviewed, mechanism direction) flagged directly on edges and disease views, with both positions, sources, urgency-ranked consensus gaps, and the **specific experiment** that would resolve each. | *Where the evidence disagrees* |
| 4 | **Latent repurposing & shelved-asset engine** | Nine mechanistic compound candidates (HP-β-CD, trehalose, vorinostat, ambroxol, miglustat, fenfluramine, cannabidiol, stiripentol, phenytoin/carbamazepine) mapped to shared pathway bottlenecks, with regulatory history, translation-readiness score (safety + brain penetration), contradiction warnings, and one-click **Send to dossier**. | *Latent repurposing* |
| 5 | **One-click 12-section research dossier** | On any disease, pathway, or persona view: an IRB/grant-grade briefing with conditions, target genes, mechanistic hypotheses, matched investigators, studies, infrastructure, conflicts, proposed experiments, evidence table, citations, and ethics notes. Copy, download as Markdown, or print to PDF. | *Generate dossier* |
| 6 | **Research grounding — RARe-SOURCE benchmark** | A sources audit of all 14 resource families named in the challenge brief across three layers (biology & ontologies, research & preclinical, advocacy & trials), cross-referenced disease/gene IDs harmonized to RARe-SOURCE standards (OMIM, Orphanet, CTD, bioDBnet), and a cited overview of NIH NCATS RARe-SOURCE. | *Research grounding* |

---

## Persona journeys

Four switchable demo views in the header ("Viewing as"). Each is a complete journey, not a filter.

### Maria — patient leader · *Pathway Navigator*
Maria runs a patient organization and needs to turn one diagnosis into a coalition. Starting from Niemann–Pick type C, the atlas walks a numbered route — NPC → the shared lipid-clearance process → Gaucher disease (the neighboring community) → the NPC patient registry — and ends with a concrete **"What to do this week"** card: ask a lysosomal-disease clinician which outcome measures are comparable, contact the foundation about registry governance, frame a small study question to test whether the shared signal holds in both communities. Every suggestion is footed as an outreach question, not a verified collaboration.

### Devon — newly diagnosed caregiver · *Where to Start*
Devon needs plain language and honesty, not jargon. The view opens with what the gene does and why it matters, points to the community of families who have walked the path, and shows what research looks like — then closes with an explicit **"What we don't know yet"** card: a shared biological process does not mean two diseases respond to the same treatment, and live trial status and eligibility are not verified here. The map never promises answers science does not have.

### Priya — biotech scout · *Opportunity Signals*
Priya ranks disease clusters by mapped infrastructure — diseases, advocacy groups, study concepts, and research assets per pathway — with the caveat displayed where she can't miss it: *ranked by infrastructure, not clinical readiness*. The lysosomal-clearance cluster shows high network density with a substrate-specificity warning; the neuronal-excitability cluster shows variant-dependent opportunity with the gain/loss-of-function caveat attached.

### Dr. Osei — researcher · *Collaborator Explorer*
Dr. Osei works on one mechanism that hides under four gene names. The view is organized by mechanism rather than gene: sodium-channel dysfunction (SCN1A · SCN2A · SCN8A) and lipid clearance (NPC1 · NPC2 · GBA1 · GLA) each surface the investigators publishing across the whole family — examples only, with no implied involvement — plus the consensus gaps and proposed experiments that make a cross-disease collaboration fundable.

---

## System architecture

```
                    ┌──────────────────────────────────────────────┐
                    │                BROWSER (client)              │
                    │                                              │
  pasted clinical ─▶│  Clinical intake ── local HPO extraction     │
  notes (PHI)       │  (never leaves the device)                   │
                    │        │                                     │
                    │        ▼                                     │
                    │  Phenotype profile overlay on the graph      │
                    │        │                                     │
                    │        ▼                                     │
                    │  Atlas graph — typed data module + d3-force  │
                    │  (nodes, edges, confidence, observed/        │
                    │   inferred, caveats, disputes)               │
                    │        │                                     │
                    │        ▼                                     │
                    │  Export pipelines: dossier (Copy / Markdown  │
                    │  / Print-to-PDF), cross-reference links      │
                    └────────────┬─────────────────────────────────┘
                                 │ server function (no PHI)
                                 ▼
                    ┌──────────────────────────────────────────────┐
                    │              SERVER (edge runtime)           │
                    │  Research signals:                           │
                    │   • Official APIs — ClinicalTrials.gov v2,   │
                    │     NIH RePORTER (live official feed)        │
                    │   • Bright Data — patient-organization pages │
                    │     for registry links (live page)           │
                    │   • Curated fallbacks — labeled "unverified" │
                    └──────────────────────────────────────────────┘
```

**Data ingestion.** `src/lib/bright-data.functions.ts` runs only on the server. It queries the ClinicalTrials.gov v2 and NIH RePORTER official APIs directly (ClinicalTrials.gov blocks residential scraping, so its official API is the primary path) and uses Bright Data to inspect patient-organization pages for registry links when `BRIGHT_DATA_API_KEY` is configured. Every returned record is labeled **Bright Data live page**, **Live official feed**, or **Curated fallback · unverified**.

**Browser-local HPO extraction.** `src/lib/clinical-intake.ts` matches a deliberately narrow vocabulary — only phenotypes represented in the auditable demo atlas — handles clause-aware negation ("no seizures" is marked, not counted), and ranks diseases by transparent feature overlap. Input is parsed locally; **no pasted note, symptom, or identifying detail is ever sent to any service**. The score is a map-overlap heuristic, explicitly not a diagnostic probability.

**Causal graph topology.** `src/lib/atlas-data.ts` is the single deterministic source: every node, edge, synonym, source reference, confidence estimate, evidence status, and caveat is typed and inspectable. The graph renders as SVG driven by d3-force in `src/components/AtlasGraph.tsx`, so pan, zoom, selection, and semantic highlighting stay lightweight and auditable. Search normalizes case, punctuation, and accents across labels and aliases ("Niemann-Pick" surfaces the NPC alias).

**Export pipelines.** `src/lib/frontier.ts` assembles the 12-section dossier from the scoped subgraph plus queued repurposing candidates, with Copy, Markdown download, and print-to-PDF. `src/lib/grounding.ts` provides RARe-SOURCE-style cross-references (OMIM, Orphanet, CTD, bioDBnet) rendered as clickable identifiers on every disease and gene.

---

## Scientific provenance & data integrity

This prototype is built to be **auditable first**. Three strictly separated classes of data appear in the app, and each is labeled everywhere it renders:

1. **Official live feeds** — ClinicalTrials.gov v2 and NIH RePORTER records fetched at request time and labeled *Live official feed*. Freshness and coverage are the source systems'.
2. **Bright Data live pages** — patient-organization pages inspected at request time and labeled *Bright Data live page*. Registry availability changes; listings are research leads only.
3. **Illustrative demo records** — the seeded atlas itself, plus curated fallbacks. **All PMID, NCT, bioRxiv, and ClinVar identifiers marked "(demo)" are illustrative placeholders, not verified records.** Variant and asset links are marked *Inferred* with low confidence and explicit caveats. Confidence scores are editorial demo estimates, not model-derived probabilities or clinical evidence grades. Named researchers are examples, with no implied involvement or availability.

Additional standing rules the product enforces:

- Live research results are shown **separately** from the illustrative graph and are never merged into it as evidence.
- The graph is **not medical advice**, a treatment recommendation, or a live registry of active trials. Node and edge panels state this in plain language.
- Where evidence is missing or contradictory, the atlas says so and shows what would resolve it — it never collapses disagreement into a single confident claim.
- Cross-references to Orphanet, CTD, and bioDBnet are labeled demo mappings to re-verify against each source before reuse.

---

## Production roadmap

| Phase | Horizon | Status | Scope |
|---|---|---|---|
| **01 — Hackathon & pilot** | Now | Prototype in preview | Two illustrative clusters — lysosomal disorders and epileptic encephalopathies — with the interactive graph, local HPO intake, contradiction radar, repurposing engine, dossier generator, and live research signals. Public deployment done; clinical validation and production evidence feeds are not. |
| **02 — Months 1–6** | Proposed | — | Audited ETL with provenance, deduplication, and refresh checks for NIH RePORTER, PubMed E-Utilities, Orphanet SPARQL where available, and permitted Bright Data collection; open a foundation portal. Access and licensing to be assessed. |
| **03 — Months 6–18** | Proposed | — | SMART on FHIR EHR integration and decentralized trial matching, conditional on clinical validation, privacy review, security, governance, consent, and regulatory assessment. No clinical decision support is offered before then. |

---

## Run locally

Requires [Bun](https://bun.sh) (or a compatible Node.js package manager).

```sh
bun install
bun run dev
```

Open the local URL printed by Vite. `bun run build` produces a production build.

### Reproduce the dataset

The shipped dataset is deterministic: `nodes` and `edges` in `src/lib/atlas-data.ts` are the complete source. There are two manually curated demonstration clusters:

- **Lysosomal lipid clearance** — Niemann–Pick type C, Gaucher, Fabry (shared lipid-accumulation pathway)
- **Neuronal excitability** — Dravet/SCN1A, SCN2A, SCN8A, KCNQ2 (sodium/potassium channelopathy)

It contains genes, illustrative variant classes, phenotypes, studies, patient groups, registries/models, and named researchers. Change those arrays to add or remove records; every edge references its endpoint IDs. Search, the graph, the dossier generator, and the intake matcher all derive from the same arrays, so edits propagate everywhere.

Optional: set `BRIGHT_DATA_API_KEY` to enable live Bright Data page inspection; official ClinicalTrials.gov and NIH RePORTER lookups work without any key.

### What is not connected yet

No broad clinical NLP, persistent search history, authenticated contribution, or automated evidence reconciliation. Live research results stay separate from the illustrative graph rather than becoming graph evidence automatically. Before using the atlas for real decisions, replace illustrative references with verified source records, verify each study's status and eligibility, review contradictory literature, and confirm data reuse and researcher participation with their owners.

---

*Constellation is an independent hackathon prototype and is not affiliated with, or endorsed by, NIH, NCATS, or RARe-SOURCE.*
