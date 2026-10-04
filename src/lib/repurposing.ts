import { useSyncExternalStore } from 'react';

export type RegStatus = 'FDA Approved' | 'Phase II Shelved' | 'Off-patent Generic' | 'Investigational';
export type Compound = {
  id: string; name: string; diseaseIds: string[]; mechanismId: string; target: string;
  originalIndication: string; status: RegStatus[]; rationale: string; bottleneck: string;
  safety: number; bbb: number; disputeId?: string; warning?: string; citations: string[];
};

/** Translation readiness 0-100: 60% safety profile, 40% blood-brain barrier penetration (editorial demo weights). */
export const readiness = (c: Compound) => Math.round(c.safety * 60 + c.bbb * 40);

export const compounds: Compound[] = [
  { id: 'hpbcd', name: 'HP-β-cyclodextrin', diseaseIds: ['npc'], mechanismId: 'lipid', target: 'NPC1', originalIndication: 'Pharmaceutical excipient (drug solubiliser)', status: ['Investigational'], bottleneck: 'Late-endosomal cholesterol trapping', rationale: 'Binds and mobilises unesterified cholesterol out of late endosomes/lysosomes, bypassing the missing NPC1/NPC2 transfer step.', safety: .55, bbb: .15, warning: 'Poor BBB penetration requires intrathecal dosing; ototoxicity reported. Phase 2b/3 endpoint results are debated.', citations: ['PMID:30000201 (demo)', 'NCT00000011 (demo)'] },
  { id: 'trehalose', name: 'Trehalose', diseaseIds: ['npc'], mechanismId: 'autophagy', target: 'TFEB / autophagy', originalIndication: 'Food additive; trialled in neurodegeneration', status: ['Phase II Shelved'], bottleneck: 'Stalled autophagic flux', rationale: 'Activates TFEB-driven lysosomal biogenesis and autophagy, aiming to clear secondary storage downstream of the lipid block.', safety: .85, bbb: .3, disputeId: 'd-autophagy', warning: 'Relies on autophagy being causal; the preprint vs peer-reviewed dispute questions whether autophagy drives storage.', citations: ['PMID:30000202 (demo)', 'bioRxiv 2025.01.0001 (demo, preprint)'] },
  { id: 'vorinostat', name: 'Vorinostat (HDAC inhibitor)', diseaseIds: ['npc'], mechanismId: 'lipid', target: 'Mutant NPC1 folding', originalIndication: 'Cutaneous T-cell lymphoma', status: ['FDA Approved'], bottleneck: 'Misfolded NPC1 degraded in ER', rationale: 'Upregulates chaperone networks so misfolded NPC1 protein escapes ER degradation and reaches the lysosome.', safety: .45, bbb: .45, warning: 'Oncology toxicity profile limits chronic paediatric use; benefit only for folding-competent variants.', citations: ['PMID:30000203 (demo)', 'NCT00000012 (demo)'] },
  { id: 'ambroxol', name: 'Ambroxol', diseaseIds: ['gaucher'], mechanismId: 'lipid', target: 'GBA1 (GCase)', originalIndication: 'Mucolytic for respiratory disease', status: ['Off-patent Generic'], bottleneck: 'Misfolded GCase fails lysosomal trafficking', rationale: 'Acts as a pH-dependent pharmacological chaperone that stabilises GCase in the ER and releases it in the acidic lysosome.', safety: .9, bbb: .65, warning: 'High doses needed for CNS effect; variant-specific responsiveness.', citations: ['PMID:30000204 (demo)', 'NCT00000013 (demo)'] },
  { id: 'miglustat', name: 'Miglustat', diseaseIds: ['gaucher', 'npc'], mechanismId: 'lipid', target: 'Glucosylceramide synthase', originalIndication: 'Gaucher type 1 (substrate reduction)', status: ['FDA Approved'], bottleneck: 'Glycosphingolipid influx exceeds clearance', rationale: 'Reduces glycosphingolipid synthesis so impaired lysosomes face a smaller substrate load — a cross-cluster bottleneck shared with NPC.', safety: .7, bbb: .6, citations: ['PMID:30000205 (demo)'] },
  { id: 'fenfluramine', name: 'Fenfluramine', diseaseIds: ['dravet'], mechanismId: 'sodium', target: '5-HT2 / sigma-1', originalIndication: 'Appetite suppressant (withdrawn 1997)', status: ['FDA Approved'], bottleneck: 'Interneuron hypoexcitability from SCN1A loss', rationale: 'Serotonergic and sigma-1 signalling restores inhibitory tone that is lost when SCN1A haploinsufficiency silences interneurons.', safety: .6, bbb: .85, disputeId: 'd-dravet-endpoint', warning: 'Echocardiogram monitoring required (valvulopathy history). Benefit measured mainly by seizure frequency — endpoint dispute applies.', citations: ['PMID:30000206 (demo)', 'NCT00000003 (demo)'] },
  { id: 'cbd', name: 'Cannabidiol', diseaseIds: ['dravet'], mechanismId: 'sodium', target: 'GPR55 / TRPV1 / adenosine', originalIndication: 'Botanical; developed for refractory epilepsy', status: ['FDA Approved'], bottleneck: 'Network hyperexcitability', rationale: 'Dampens excitatory signalling via several low-affinity targets, partially compensating for reduced interneuron firing.', safety: .75, bbb: .8, disputeId: 'd-dravet-endpoint', warning: 'Interacts with clobazam and valproate (liver enzymes).', citations: ['PMID:30000207 (demo)'] },
  { id: 'stiripentol', name: 'Stiripentol', diseaseIds: ['dravet'], mechanismId: 'sodium', target: 'GABA-A receptor', originalIndication: 'Developed as an anticonvulsant adjunct', status: ['FDA Approved'], bottleneck: 'Deficient GABAergic inhibition', rationale: 'Positive allosteric modulation of GABA-A receptors boosts the inhibition that SCN1A loss removes.', safety: .7, bbb: .85, citations: ['PMID:30000208 (demo)'] },
  { id: 'phenytoin', name: 'Phenytoin / Carbamazepine', diseaseIds: ['scn2a-d', 'scn8a-d'], mechanismId: 'sodium', target: 'Voltage-gated Na⁺ channels', originalIndication: 'Focal and generalised epilepsy', status: ['Off-patent Generic'], bottleneck: 'Excess persistent sodium current (gain-of-function)', rationale: 'Blocks over-active sodium channels in early-onset gain-of-function SCN2A/SCN8A variants.', safety: .55, bbb: .9, disputeId: 'd-scn2a-dir', warning: 'Contraindicated in loss-of-function SCN2A and in SCN1A/Dravet — may worsen seizures. Variant direction must be established first.', citations: ['PMID:30000101 (demo)', 'PMID:30000102 (demo)'] },
];

// Tiny shared store of compounds queued for the dossier.
let queued: string[] = [];
const subs = new Set<() => void>();
const emit = () => subs.forEach(f => f());
export const dossierQueue = {
  get: () => queued,
  toggle: (id: string) => { queued = queued.includes(id) ? queued.filter(x => x !== id) : [...queued, id]; emit(); },
  subscribe: (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; },
};
const empty: string[] = [];
export const useDossierQueue = () => useSyncExternalStore(dossierQueue.subscribe, dossierQueue.get, () => empty);

export function repurposingMarkdown(ids: string[]): { hypotheses: string[]; citations: string[] } {
  const list = compounds.filter(c => ids.includes(c.id));
  return {
    hypotheses: list.map(c => `- **Repurposing candidate: ${c.name}** (target ${c.target}; readiness ${readiness(c)}/100)\n  - Regulatory history: ${c.originalIndication} — ${c.status.join(', ')}\n  - Mechanistic rationale: ${c.rationale} Bottleneck: ${c.bottleneck}.${c.warning ? `\n  - Contradiction warning: ${c.warning}` : ''}\n  - Preclinical citations: ${c.citations.join('; ')}`),
    citations: list.flatMap(c => c.citations),
  };
}
