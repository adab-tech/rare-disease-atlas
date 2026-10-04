// Cross-reference identifiers harmonized to RARe-SOURCE-style standards.
// OMIM IDs match the atlas records; Orphanet, MeSH (used by CTD) and NCBI Gene (bioDBnet input) IDs are
// provided for demo harmonization and should be re-verified against each source before reuse.
export type XRef = { system: 'OMIM' | 'Orphanet' | 'CTD' | 'bioDBnet' | 'GARD'; id: string; url: string };
const omim = (id: string): XRef => ({ system: 'OMIM', id: `OMIM:${id}`, url: `https://omim.org/entry/${id}` });
const orpha = (id: string): XRef => ({ system: 'Orphanet', id: `ORPHA:${id}`, url: `https://www.orpha.net/en/disease/detail/${id}` });
const ctdDisease = (mesh: string): XRef => ({ system: 'CTD', id: `MESH:${mesh}`, url: `https://ctdbase.org/detail.go?type=disease&acc=MESH:${mesh}` });
const ctdGene = (gene: string, entrez: string): XRef => ({ system: 'CTD', id: `Gene:${gene}`, url: `https://ctdbase.org/detail.go?type=gene&acc=${entrez}` });
const biodb = (entrez: string): XRef => ({ system: 'bioDBnet', id: `GeneID:${entrez}`, url: `https://biodbnet-abcc.ncifcrf.gov/db/db2db.php` });

export const xrefs: Record<string, XRef[]> = {
  npc: [omim('257220'), orpha('646'), ctdDisease('D052556')],
  gaucher: [omim('230800'), orpha('355'), ctdDisease('D005776')],
  fabry: [omim('301500'), orpha('324'), ctdDisease('D000795')],
  dravet: [omim('607208'), orpha('33069'), ctdDisease('D004831')],
  'scn2a-d': [omim('613721'), orpha('140927')],
  'scn8a-d': [omim('614558'), orpha('306558')],
  'kcnq2-d': [omim('613720'), orpha('439218')],
  npc1: [omim('607623'), ctdGene('NPC1', '4864'), biodb('4864')],
  npc2: [omim('601015'), ctdGene('NPC2', '10577'), biodb('10577')],
  gba1: [omim('606463'), ctdGene('GBA1', '2629'), biodb('2629')],
  gla: [omim('300644'), ctdGene('GLA', '2717'), biodb('2717')],
  scn1a: [omim('182389'), ctdGene('SCN1A', '6323'), biodb('6323')],
  scn2a: [omim('182390'), ctdGene('SCN2A', '6326'), biodb('6326')],
  scn8a: [omim('600702'), ctdGene('SCN8A', '6334'), biodb('6334')],
  kcnq2: [omim('602235'), ctdGene('KCNQ2', '3785'), biodb('3785')],
};

export const gaps = [
  { n: 1, title: 'Literature co-occurrence → mechanistic causality', from: 'RARe-SOURCE mines Medline abstracts for disease–gene co-mentions.', to: 'Constellation adds directed gene → variant → pathway → phenotype links, each marked observed or inferred with a confidence score.' },
  { n: 2, title: 'Harmonized aggregation → contradiction resolution', from: 'Aggregated evidence is summarized as counts and harmonized records.', to: 'Constellation flags conflicts such as gain- vs loss-of-function variants and proposes the experiment that would resolve each one.' },
  { n: 3, title: 'Structured querying → zero-friction clinical intake', from: 'Queries assume the user already knows the disease or identifier.', to: 'Constellation pulls HPO terms from pasted notes or discharge summaries, locally in the browser, and ranks overlapping clusters.' },
  { n: 4, title: 'Flat identifier exports → multi-stakeholder action dossiers', from: 'Results export as CSV tables of identifiers.', to: 'Constellation produces a 12-section IRB/grant briefing with hypotheses, investigators, studies, conflicts and citations.' },
];

export type AuditSource = { name: string; links: { label: string; url: string }[]; baseline: string; opportunity: string; status: 'Prototype' | 'Planned' };
export type AuditLayer = { number: string; title: string; focus: string; sources: AuditSource[] };

// The 14 entries below count paired resources (PubMed/PMC and bioRxiv/medRxiv) as one source family each.
// Opportunities describe product directions, not validated capabilities or current data integrations.
export const sourceAudit: AuditLayer[] = [
  { number: '01', title: 'Biology & ontologies', focus: 'From descriptive records to testable connections', sources: [
    { name: 'OMIM', links: [{ label: 'OMIM', url: 'https://www.omim.org/' }], baseline: 'Narrative disease and phenotype descriptions.', opportunity: 'Translate documented gene–disease relationships into a computable causal graph, with provenance and uncertainty.', status: 'Prototype' },
    { name: 'MONDO', links: [{ label: 'MONDO', url: 'https://mondo.monarchinitiative.org/' }], baseline: 'Disease taxonomy and cross-ontology mappings.', opportunity: 'Use mapped disease identities and hierarchy to compare shared pathways; taxonomy alone does not establish mechanistic homology.', status: 'Planned' },
    { name: 'HPO', links: [{ label: 'HPO', url: 'https://hpo.jax.org/' }], baseline: 'Curated phenotype terms often require structured manual entry.', opportunity: 'Extract a limited set of HPO-coded findings from pasted notes locally; clinical-grade EHR extraction requires validation.', status: 'Prototype' },
    { name: 'ClinVar', links: [{ label: 'ClinVar', url: 'https://www.ncbi.nlm.nih.gov/clinvar/' }], baseline: 'Variant submissions may disagree on pathogenicity or remain VUS.', opportunity: 'Surface submission-level discordance and evidence provenance in a contradiction radar, rather than collapsing disagreements into one claim.', status: 'Planned' },
  ] },
  { number: '02', title: 'Research & preclinical', focus: 'From scattered publications and assets to collaborators', sources: [
    { name: 'PubMed / PMC', links: [{ label: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/' }, { label: 'PMC', url: 'https://pmc.ncbi.nlm.nih.gov/' }], baseline: 'Papers and full-text evidence are dispersed across disease-specific searches.', opportunity: 'Link cited claims across diseases to investigators and shared mechanisms; verify authorship before suggesting collaborators.', status: 'Planned' },
    { name: 'NIH RePORTER', links: [{ label: 'NIH RePORTER', url: 'https://reporter.nih.gov/' }], baseline: 'Awards and investigators are searchable but separate from the disease graph.', opportunity: 'Connect live awardees to cross-disease research questions; an award is not proof of availability or collaboration.', status: 'Prototype' },
    { name: 'bioRxiv / medRxiv', links: [{ label: 'bioRxiv', url: 'https://www.biorxiv.org/' }, { label: 'medRxiv', url: 'https://www.medrxiv.org/' }], baseline: 'Preprints arrive before peer review and may change.', opportunity: 'Weight inferred claims by evidence maturity and provenance using a calibrated Bayesian model; not implemented or validated yet.', status: 'Planned' },
    { name: 'Jackson Laboratory / JAX', links: [{ label: 'JAX', url: 'https://www.jax.org/' }], baseline: 'Animal models are catalogued separately from clinical evidence.', opportunity: 'Link model availability and genotype to disease mechanisms as reusable research assets, with validation of model relevance.', status: 'Planned' },
  ] },
  { number: '03', title: 'Advocacy & trials', focus: 'From regional directories to equitable study planning', sources: [
    { name: 'Orphanet', links: [{ label: 'Orphanet', url: 'https://www.orpha.net/' }], baseline: 'Rare disease identifiers and resources span national contexts.', opportunity: 'Harmonize disease identities and link verified regional resources to federated organization nodes.', status: 'Planned' },
    { name: 'NORD', links: [{ label: 'NORD', url: 'https://rarediseases.org/' }], baseline: 'US-focused patient communities and resources are separate from trial records.', opportunity: 'Connect verified community and registry listings to relevant disease pathways.', status: 'Planned' },
    { name: 'EURORDIS', links: [{ label: 'EURORDIS', url: 'https://www.eurordis.org/' }], baseline: 'European patient voices sit in a distinct regional network.', opportunity: 'Represent regional advocacy links without treating membership as endorsement or a live registry.', status: 'Planned' },
    { name: 'Global Genes', links: [{ label: 'Global Genes', url: 'https://globalgenes.org/' }], baseline: 'Community resources are not natively joined to mechanistic evidence.', opportunity: 'Federate verified organization connections across diseases and research assets.', status: 'Planned' },
    { name: 'Rare Disease UK', links: [{ label: 'Rare Disease UK', url: 'https://www.raredisease.org.uk/' }], baseline: 'UK advocacy and policy resources are region-specific.', opportunity: 'Add jurisdiction-aware organization nodes and preserve regional context.', status: 'Planned' },
    { name: 'ClinicalTrials.gov', links: [{ label: 'ClinicalTrials.gov', url: 'https://clinicaltrials.gov/' }], baseline: 'Registered studies and site locations are searchable but do not establish global access.', opportunity: 'Extend live study-site lookup with independently validated international feasibility and equity measures.', status: 'Prototype' },
  ] },
];

export const scalingPhases = [
  { phase: '01', period: 'Hackathon & pilot', status: 'Prototype in preview', summary: 'Two illustrative clusters—lysosomal disorders and epileptic encephalopathies—with an interactive graph, limited local HPO intake, demo contradiction radar and dossier export. Public deployment, clinical validation and production evidence feeds are not complete.' },
  { phase: '02', period: 'Months 1–6', status: 'Proposed', summary: 'Build audited ETL with provenance, deduplication and refresh checks for NIH RePORTER, PubMed E-Utilities, Orphanet SPARQL where available, and permitted Bright Data collection; open a foundation portal. Access and licensing remain to be assessed.' },
  { phase: '03', period: 'Months 6–18', status: 'Proposed', summary: 'Explore SMART on FHIR integration and decentralized trial matching, conditional on clinical validation, privacy review, security, governance, consent and regulatory assessment. No clinical decision support is currently offered.' },
];
