import { repurposingMarkdown } from './repurposing';
import { edges, getNode, nodes, type AtlasNode, type Cluster } from '@/lib/atlas-data';

export type DisputeKind = 'Variant pathogenicity' | 'Trial endpoint' | 'Preprint vs peer-reviewed' | 'Mechanism direction';
export type Dispute = { id: string; edgeId: string; kind: DisputeKind; severity: 'high' | 'moderate'; summary: string; sideA: string; sideB: string; refs: string[]; experiment: string };
export type FrontierGap = { id: string; cluster: Cluster; nodeIds: string[]; question: string; why: string; urgency: number; experiment: string };

// Illustrative disputes. All references marked (demo) are placeholders, not verified records.
export const disputes: Dispute[] = [
  { id: 'd-scn2a-dir', edgeId: 'scn2a-scn2a-var', kind: 'Mechanism direction', severity: 'high', summary: 'Gain- and loss-of-function SCN2A variants may call for opposite treatment strategies.', sideA: 'Early-onset cases often show increased channel activity; sodium-channel blockers may help some.', sideB: 'Later-onset or autism-predominant cases often show reduced activity; blockers may worsen symptoms.', refs: ['PMID:30000101 (demo)', 'PMID:30000102 (demo)'], experiment: 'Patch-clamp classification of registry variants paired with treatment-response records.' },
  { id: 'd-scn1a-clinvar', edgeId: 'scn1a-scn1a-var', kind: 'Variant pathogenicity', severity: 'moderate', summary: 'Some SCN1A missense variants carry conflicting pathogenicity calls across submitters.', sideA: 'Several labs classify selected missense variants as likely pathogenic.', sideB: 'Other submitters list the same variants as uncertain significance.', refs: ['ClinVar conflicting interpretations (demo)'], experiment: 'Functional assay panel for variants with conflicting ClinVar submissions.' },
  { id: 'd-autophagy', edgeId: 'lipid-autophagy', kind: 'Preprint vs peer-reviewed', severity: 'moderate', summary: 'A preprint reports autophagy restoration reduces storage; peer-reviewed work finds it is secondary.', sideA: 'Preprint (not peer-reviewed): restoring autophagy lowered lipid storage in cell models.', sideB: 'Peer-reviewed study: autophagy changes follow storage and do not drive it.', refs: ['bioRxiv 2025.01.0001 (demo, preprint)', 'PMID:30000103 (demo)'], experiment: 'Time-course study in NPC1 and GBA1 cell models to order storage vs autophagy events.' },
  { id: 'd-dravet-endpoint', edgeId: 'dravet-dravet-trial', kind: 'Trial endpoint', severity: 'high', summary: 'Studies disagree on whether seizure frequency alone captures meaningful benefit.', sideA: 'Primary endpoint: convulsive seizure frequency reduction.', sideB: 'Families and some investigators prioritise cognition, sleep, and behaviour outcomes.', refs: ['NCT00000003 (demo)', 'PMID:30000104 (demo)'], experiment: 'Co-design a caregiver-reported outcome measure and validate it against seizure diaries.' },
  { id: 'd-gla-pathway', edgeId: 'gla-lipid', kind: 'Mechanism direction', severity: 'moderate', summary: 'Whether Fabry belongs in the same lipid-clearance cluster is debated.', sideA: 'Shared lysosomal lipid storage supports grouping.', sideB: 'Different substrate and organ involvement argue for a separate cluster.', refs: ['PMID:30000105 (demo)'], experiment: 'Compare lysosomal proteomic signatures across GLA, GBA1, and NPC1 models.' },
];

export const frontierGaps: FrontierGap[] = [
  { id: 'g-npc-gaucher', cluster: 'clearance', nodeIds: ['npc', 'gaucher', 'lipid'], question: 'Do NPC and Gaucher share a measurable biomarker of lysosomal stress?', why: 'A shared marker would let both communities pool outcome data.', urgency: .86, experiment: 'Pool registry plasma samples and test a common lipid biomarker panel.' },
  { id: 'g-scn-direction', cluster: 'channel', nodeIds: ['scn2a-d', 'scn8a-d', 'sodium'], question: 'Can variant direction be predicted before treatment choices are made?', why: 'Wrong-direction therapy may cause harm.', urgency: .93, experiment: 'Build a validated gain/loss classifier from functional data.' },
  { id: 'g-kcnq2-convergence', cluster: 'channel', nodeIds: ['kcnq2-d', 'potassium', 'sodium'], question: 'Does potassium-channel dysfunction converge with sodium-channel disease at the circuit level?', why: 'Convergence would open shared therapeutic hypotheses.', urgency: .7, experiment: 'Compare network excitability in KCNQ2 and SCN8A neuron models.' },
];

export const disputeByEdge = Object.fromEntries(disputes.map(d => [d.edgeId, d])) as Record<string, Dispute>;
export const disputesForNode = (id: string) => disputes.filter(d => { const e = edges.find(x => x.id === d.edgeId); return e && (e.source === id || e.target === id || neighbours(id).has(e.source) && neighbours(id).has(e.target)); });
const neighbours = (id: string) => new Set([id, ...edges.filter(e => e.source === id || e.target === id).map(e => e.source === id ? e.target : e.source)]);
export const gapsForNode = (id: string) => frontierGaps.filter(g => g.nodeIds.includes(id));

/* ---------- Dossier ---------- */
export type DossierScope = { kind: 'disease' | 'cluster' | 'persona'; id: string; label: string };
const related = (ids: Set<string>, type: AtlasNode['type']) => nodes.filter(n => n.type === type && edges.some(e => (ids.has(e.source) && e.target === n.id) || (ids.has(e.target) && e.source === n.id)));

export function scopeNodes(scope: DossierScope): Set<string> {
  if (scope.kind === 'cluster') return new Set(nodes.filter(n => n.cluster === scope.id).map(n => n.id));
  if (scope.kind === 'persona') {
    const map: Record<string, string[]> = { maria: ['npc', 'gaucher', 'lipid'], devon: ['npc'], priya: ['lipid', 'sodium'], osei: ['sodium', 'lipid'] };
    return new Set(map[scope.id] ?? ['npc']);
  }
  return new Set([scope.id]);
}

export function buildDossier(scope: DossierScope, compoundIds: string[] = []): string {
  const rp = repurposingMarkdown(compoundIds);
  const core = scopeNodes(scope);
  const ring = new Set(core); edges.forEach(e => { if (core.has(e.source)) ring.add(e.target); if (core.has(e.target)) ring.add(e.source); });
  const pick = (t: AtlasNode['type']) => [...new Set([...nodes.filter(n => ring.has(n.id) && n.type === t), ...related(ring, t)])];
  const diseases = pick('disease'), genes = pick('gene'), mechs = pick('mechanism'), trials = pick('trial'), people = pick('researcher'), orgs = pick('organization'), assets = pick('asset');
  const scoped = edges.filter(e => ring.has(e.source) && ring.has(e.target));
  const conflicts = disputes.filter(d => scoped.some(e => e.id === d.edgeId));
  const gaps = frontierGaps.filter(g => g.nodeIds.some(id => ring.has(id)));
  const cites = [...new Set(scoped.map(e => e.sourceRef).concat(conflicts.flatMap(d => d.refs), rp.citations))];
  const line = (n: AtlasNode) => `- **${n.label}** (${n.source ?? 'demo record'}) — ${n.description}`;
  const date = new Date().toISOString().slice(0, 10);
  return [
    `# Research Dossier: ${scope.label}`,
    `_Constellation · generated ${date} · scope: ${scope.kind}_`,
    '',
    '> **Status:** Exploratory briefing built from an illustrative demo dataset. Identifiers marked (demo) are placeholders. Not medical advice; verify every claim at source before IRB or grant use.',
    '',
    '## 1. Executive summary',
    `This brief covers ${diseases.length} condition(s), ${genes.length} target gene(s), and ${mechs.length} mechanism(s). It records ${conflicts.length} evidentiary conflict(s) and ${gaps.length} consensus gap(s) where new experiments are needed.`,
    '',
    '## 2. Conditions in scope', ...(diseases.length ? diseases.map(line) : ['- None directly in scope.']),
    '', '## 3. Target genes', ...(genes.length ? genes.map(line) : ['- None identified in this slice.']),
    '', '## 4. Mechanistic hypotheses',
    ...(mechs.length ? mechs.map((m, i) => `${i + 1}. **H${i + 1}:** Dysfunction in *${m.label.toLowerCase()}* contributes to shared features across ${diseases.map(d => d.label).join(', ') || 'the scoped conditions'}. ${m.description}`) : ['- No mechanism in scope.']), ...rp.hypotheses,
    '', '## 5. Evidentiary conflicts',
    ...(conflicts.length ? conflicts.map(d => `- **${d.kind}** (${d.severity}): ${d.summary}\n  - Position A: ${d.sideA}\n  - Position B: ${d.sideB}\n  - Sources: ${d.refs.join('; ')}`) : ['- No conflicts recorded in this demo slice. This is not an exhaustive literature review.']),
    '', '## 6. Consensus gaps and proposed experiments',
    ...(gaps.length ? gaps.map((g, i) => `${i + 1}. **${g.question}** (urgency ${g.urgency.toFixed(2)})\n   - Why it matters: ${g.why}\n   - Proposed aim: ${g.experiment}`) : ['- None recorded.']),
    '', '## 7. Matched principal investigators (examples only, no implied involvement)', ...(people.length ? people.map(p => `- ${p.label} — ${p.subtitle}`) : ['- None in scope.']),
    '', '## 8. Active / relevant studies', ...(trials.length ? trials.map(t => `- ${t.label} — ${t.source ?? ''}`) : ['- None in scope.']),
    '', '## 9. Infrastructure: patient groups and research assets', ...([...orgs, ...assets].length ? [...orgs, ...assets].map(a => `- ${a.label}${a.url ? ` — ${a.url}` : ''} (${a.subtitle})`) : ['- None in scope.']),
    '', '## 10. Evidence table', '| Relationship | Confidence | Type | Source |', '|---|---|---|---|',
    ...scoped.map(e => `| ${getNode(e.source).label} ${e.relation} ${getNode(e.target).label} | ${e.confidence.toFixed(2)} | ${e.status} | ${e.sourceRef} |`),
    '', '## 11. Citations', ...cites.map((c, i) => `${i + 1}. ${c}`),
    '', '## 12. Human-subjects and ethics notes', '- Any patient data must be de-identified and handled under an approved IRB protocol.', '- Registry access, consent scope, and data-sharing agreements must be confirmed with each organization.', '- Confidence scores are editorial demo estimates, not statistical measures.',
  ].join('\n');
}
