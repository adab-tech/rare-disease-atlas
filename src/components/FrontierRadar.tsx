import { AlertTriangle, FlaskConical } from 'lucide-react';
import { getNode, edges } from '@/lib/atlas-data';
import { disputes, frontierGaps, type Dispute } from '@/lib/frontier';
import { DossierButton } from '@/components/DossierButton';

export function DisputeCard({ d, onEdge }: { d: Dispute; onEdge?: (id: string) => void }) {
  const e = edges.find(x => x.id === d.edgeId);
  return <div className="border-l-2 border-warning bg-warning/5 p-4">
    <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[.14em]"><span className="inline-flex items-center gap-1 border border-warning/50 px-1.5 py-0.5 text-warning"><AlertTriangle className="size-3" /> Contested</span><span className="text-muted-foreground">{d.kind} · {d.severity}</span></div>
    <p className="mt-2 text-xs font-medium leading-relaxed text-foreground">{d.summary}</p>
    <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-muted-foreground"><li><span className="text-foreground">A ·</span> {d.sideA}</li><li><span className="text-foreground">B ·</span> {d.sideB}</li></ul>
    <p className="mt-2 text-[11px] text-signal"><FlaskConical className="mr-1 inline size-3" />Needed: {d.experiment}</p>
    <p className="mt-2 text-[10px] text-muted-foreground">{d.refs.join(' · ')}</p>
    {e && onEdge && <button onClick={() => onEdge(e.id)} className="mt-2 text-[11px] text-primary hover:underline">Show on map: {getNode(e.source).label} → {getNode(e.target).label}</button>}
  </div>;
}

export function FrontierRadar({ onEdge, onNode }: { onEdge: (id: string) => void; onNode: (id: string) => void }) {
  return <section className="border-b border-border py-10" aria-label="Contradiction and frontier radar">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-warning"><span className="h-px w-5 bg-warning" /> Frontier radar / 03b</div><h2 className="font-display text-3xl md:text-4xl">Where the evidence disagrees.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Conflicting variant calls, disputed trial endpoints, and preprints that contradict published work, alongside the open questions where a new experiment matters most. Contested links appear amber on the map.</p></div><div className="flex flex-wrap gap-2"><DossierButton scope={{ kind: 'cluster', id: 'clearance', label: 'Lysosomal clearance cluster' }} /><DossierButton scope={{ kind: 'cluster', id: 'channel', label: 'Neuronal excitability cluster' }} /></div></div>
    <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.15em] text-warning">Evidence conflicts <span className="text-muted-foreground">{disputes.length}</span></h3><div className="grid gap-3 md:grid-cols-2">{disputes.map(d => <DisputeCard key={d.id} d={d} onEdge={onEdge} />)}</div></div>
      <div><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.15em] text-primary">Consensus gaps, ranked by urgency</h3><div>{[...frontierGaps].sort((a, b) => b.urgency - a.urgency).map(g => <div key={g.id} className="border-b border-border py-4"><div className="flex items-start justify-between gap-3"><p className="text-xs font-medium leading-relaxed text-foreground">{g.question}</p><span className="font-mono text-[11px] text-warning">{g.urgency.toFixed(2)}</span></div><div className="mt-2 h-px bg-border"><div className="h-px bg-warning" style={{ width: `${g.urgency * 100}%` }} /></div><p className="mt-2 text-[11px] text-muted-foreground">{g.why}</p><p className="mt-1 text-[11px] text-signal">Proposed: {g.experiment}</p><div className="mt-2 flex flex-wrap gap-2">{g.nodeIds.map(id => <button key={id} onClick={() => onNode(id)} className="border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary">{getNode(id).label}</button>)}</div></div>)}</div><p className="mt-4 text-[11px] text-muted-foreground">Disputes and gaps are illustrative demo entries; references marked (demo) are placeholders.</p></div>
    </div>
  </section>;
}
