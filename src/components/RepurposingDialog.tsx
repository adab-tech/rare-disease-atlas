import { useState } from 'react';
import { AlertTriangle, Check, FlaskConical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { compounds, readiness, dossierQueue, useDossierQueue } from '@/lib/repurposing';
import { disputes } from '@/lib/frontier';
import { getNode } from '@/lib/atlas-data';

export function RepurposingDialog({ focusId, compact = false, onEdge }: { focusId?: string; compact?: boolean; onEdge?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const queue = useDossierQueue();
  const list = focusId ? compounds.filter(c => c.diseaseIds.includes(focusId) || c.mechanismId === focusId) : compounds;
  if (focusId && !list.length) return null;
  return <>
    <Button variant={compact ? 'outline' : 'ghost'} onClick={() => setOpen(true)} className={`h-9 gap-2 rounded-sm text-xs ${compact ? '' : 'h-10 border border-border px-3'}`}><FlaskConical className="size-3.5 text-primary" /><span className={compact ? '' : 'hidden md:inline'}>Latent repurposing</span>{compact && ` · ${list.length}`}</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto rounded-sm border-border bg-background p-0">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="font-display text-2xl">Latent repurposing &amp; shelved assets{focusId ? ` · ${getNode(focusId).label}` : ''}</DialogTitle>
          <DialogDescription className="text-xs leading-relaxed">Compounds that may rescue shared downstream bottlenecks. Readiness = 60% safety + 40% brain penetration (editorial demo estimate). Hypotheses only — not treatment advice. {queue.length > 0 && <span className="text-primary">{queue.length} queued for the next dossier.</span>}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {list.sort((a, b) => readiness(b) - readiness(a)).map(c => {
            const r = readiness(c); const d = disputes.find(x => x.id === c.disputeId); const on = queue.includes(c.id);
            return <article key={c.id} aria-label={c.name} className="bg-background p-5">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="font-display text-xl leading-tight">{c.name}</h3><p className="mt-1 text-[10px] uppercase tracking-[.14em] text-muted-foreground">{c.diseaseIds.map(id => getNode(id).label).join(' · ')} → {c.target}</p></div>
                <div className="text-right"><div className={`font-display text-2xl ${r >= 70 ? 'text-signal' : r >= 50 ? 'text-primary' : 'text-warning'}`}>{r}</div><div className="text-[9px] uppercase tracking-[.14em] text-muted-foreground">Readiness</div></div>
              </div>
              <div className="mt-2 h-1 bg-secondary"><div className="h-1 bg-primary" style={{ width: `${r}%` }} /></div>
              <div className="mt-3 flex flex-wrap gap-1.5">{c.status.map(s => <span key={s} className="border border-border px-2 py-0.5 text-[10px] text-foreground">{s}</span>)}<span className="px-1 py-0.5 text-[10px] text-muted-foreground">Safety {Math.round(c.safety * 100)} · BBB {Math.round(c.bbb * 100)}</span></div>
              <p className="mt-3 text-[11px] text-muted-foreground"><span className="text-foreground">Original indication:</span> {c.originalIndication}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><span className="text-foreground">Rescue rationale:</span> {c.rationale} <span className="text-primary">Bottleneck: {c.bottleneck}.</span></p>
              {c.warning && <div className="mt-3 border-l-2 border-warning bg-warning/5 p-2.5 text-[11px] leading-relaxed text-muted-foreground"><span className="flex items-center gap-1.5 font-medium text-warning"><AlertTriangle className="size-3" /> Contradiction warning</span>{c.warning}{d && <button className="mt-1 block text-warning underline-offset-2 hover:underline" onClick={() => { onEdge?.(d.edgeId); setOpen(false); }}>Radar: {d.kind} — {d.summary}</button>}</div>}
              <p className="mt-3 text-[10px] text-muted-foreground">{c.citations.join(' · ')}</p>
              <Button size="sm" variant={on ? 'default' : 'outline'} onClick={() => dossierQueue.toggle(c.id)} className="mt-3 h-8 gap-1.5 rounded-sm text-xs">{on ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}{on ? 'In dossier' : 'Send to dossier'}</Button>
            </article>;
          })}
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
