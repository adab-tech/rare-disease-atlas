import { edges, nodes, type Cluster } from './atlas-data';

export type Finding = { id: string; label: string; hpo: string; phrase: string; negated: boolean };
export type Match = { id: string; label: string; cluster: Cluster; score: number; matched: string[]; missing: string[] };
const vocabulary: Record<string, string[]> = {
  ataxia: ['ataxia', 'unsteady walking', 'unsteady gait', 'poor coordination', 'difficulty coordinating', 'loss of balance'],
  splenomegaly: ['splenomegaly', 'enlarged spleen', 'spleen enlargement'],
  seizures: ['seizures', 'seizure', 'epilepsy', 'convulsions', 'convulsion', 'fits'],
  delay: ['developmental delay', 'delayed development', 'delayed milestones', 'developmental regression', 'late milestones'],
};
const negative = /\b(no|not|denies|without|negative for|absence of|ruled out|never had|no history of)\b/i;
// Deliberately narrow: only terms represented in the auditable demo atlas are extracted.
export function parseClinicalNote(note: string): Finding[] {
  const sentences = note.split(/[.;\n]+/).map(s => s.trim()).filter(Boolean);
  const found = new Map<string, Finding>();
  for (const sentence of sentences) {
    for (const [id, phrases] of Object.entries(vocabulary)) {
      const phrase = phrases.find(p => new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(sentence));
      if (!phrase) continue;
      const node = nodes.find(n => n.id === id);
      if (!node) continue;
      const position = sentence.toLowerCase().indexOf(phrase);
      const prefix = sentence.slice(Math.max(0, position - 38), position);
      // A negation after the term or in an earlier comma/contrast clause does not negate it.
      const clause = prefix.split(/,|\b(?:but|however|although)\b/i).at(-1) ?? '';
      const negated = negative.test(clause);
      const previous = found.get(id);
      if (!previous || (previous.negated && !negated)) found.set(id, { id, label: node.label, hpo: node.subtitle, phrase, negated });
    }
  }
  return [...found.values()];
}

export function rankDifferential(findings: Finding[]): Match[] {
  const positive = findings.filter(f => !f.negated);
  const negativeIds = new Set(findings.filter(f => f.negated).map(f => f.id));
  if (!positive.length) return [];
  return nodes.filter(n => n.type === 'disease').map(disease => {
    const links = edges.filter(e => e.source === disease.id && e.relation === 'has phenotype');
    const supported = links.map(e => e.target);
    const matched = positive.filter(f => supported.includes(f.id)).map(f => f.label);
    const missing = positive.filter(f => !supported.includes(f.id)).map(f => f.label);
    const contradictory = supported.filter(id => negativeIds.has(id)).length;
    // This is a transparent map-overlap heuristic, NOT calibrated diagnostic probability.
    const score = Math.max(0, Math.round(100 * (matched.length / positive.length) * .75 + 25 * (matched.length / Math.max(1, supported.length)) - 20 * contradictory));
    return { id: disease.id, label: disease.label, cluster: disease.cluster, score, matched, missing };
  }).filter(m => m.matched.length > 0).sort((a,b) => b.score - a.score || a.label.localeCompare(b.label));
}
