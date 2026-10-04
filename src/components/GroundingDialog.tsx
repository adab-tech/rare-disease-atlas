import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { gaps, scalingPhases, sourceAudit, type XRef } from '@/lib/grounding';

export function XRefList({ refs }: { refs: XRef[] }) {
  return <div className="flex flex-wrap gap-1.5">{refs.map(r => <a key={r.system + r.id} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground hover:border-primary hover:text-primary"><span className="text-primary">{r.system}</span> {r.id}<ArrowUpRight className="size-3" /></a>)}</div>;
}

export function GroundingDialog() {
  return <Dialog>
    <DialogTrigger asChild><Button variant="ghost" className="h-10 gap-2 border border-border px-3 text-xs" aria-label="Research grounding and benchmark"><BookOpen className="!size-3.5 text-primary" /><span className="hidden sm:inline">Research grounding</span></Button></DialogTrigger>
    <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-4xl overflow-y-auto rounded-sm border-border bg-background p-4 sm:p-6 md:p-8">
      <DialogHeader className="text-left">
        <div className="text-[10px] uppercase tracking-[.2em] text-primary">Research grounding & benchmark</div>
        <DialogTitle className="font-display text-3xl leading-tight">Built on RARe-SOURCE. Aimed at what comes next.</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">How Constellation relates to the NIH NCATS rare disease knowledge resource.</DialogDescription>
      </DialogHeader>
      <section className="mt-4 border-l-2 border-primary bg-secondary/40 p-4">
        <p className="text-[10px] uppercase tracking-[.15em] text-muted-foreground">Foundational reference</p>
        <p className="mt-2 text-sm text-foreground">NIH NCATS RARe-SOURCE: <em>Transforming Data to Rare Disease Knowledge</em>.</p>
        <p className="mt-1 text-xs text-muted-foreground">Therapeutic Development Branch, Division of Preclinical Innovation, National Center for Advancing Translational Sciences, with ABCS.</p>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">RARe-SOURCE organizes knowledge on more than 10,000 rare diseases and mines Medline literature to connect diseases with genes, phenotypes and research resources. It uses identifier standards such as OMIM, Orphanet, CTD and bioDBnet. Constellation builds on that foundation and does not replace it.</p>
        <a href="https://raresource.nih.gov" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">raresource.nih.gov <ArrowUpRight className="size-3.5" /></a>
      </section>
      <section className="mt-6">
        <h3 className="text-[10px] font-semibold uppercase tracking-[.15em] text-muted-foreground">Four gaps Constellation addresses</h3>
        <div className="mt-3 grid gap-px border border-border bg-border md:grid-cols-2">{gaps.map(g => <div key={g.n} className="bg-background p-4"><div className="font-mono text-[11px] text-primary">Gap {g.n}</div><p className="mt-1 font-display text-lg leading-snug">{g.title}</p><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground"><span className="text-foreground">Baseline ·</span> {g.from}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground"><span className="text-signal">Constellation ·</span> {g.to}</p></div>)}</div>
      </section>
      <section className="mt-8 border-t border-border pt-7" aria-labelledby="sources-audit-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 id="sources-audit-heading" className="font-display text-2xl text-foreground">Sources audit</h3><span className="font-mono text-[10px] uppercase text-primary">14 source families / 3 layers</span></div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">These are source-to-opportunity comparisons, not claims that every source is ingested. “Prototype” means limited demo coverage, not a validated production integration. Paired resources count as one family each.</p>
        {sourceAudit.map(layer => <div key={layer.number} className="mt-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border pb-2"><span className="font-mono text-xs text-primary">{layer.number}</span><h4 className="font-display text-xl text-foreground">{layer.title}</h4><span className="text-[11px] text-muted-foreground">{layer.focus}</span></div>
          <div className="divide-y divide-border">{layer.sources.map(source => <div key={source.name} className="grid gap-2 py-3 sm:grid-cols-[minmax(150px,0.85fr)_minmax(0,2fr)] sm:gap-5">
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium text-foreground">{source.name}</span><span className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase ${source.status === 'Prototype' ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'}`}>{source.status}</span></div><div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">{source.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[11px] text-primary hover:underline">{link.label}<ArrowUpRight className="size-3"/></a>)}</div></div>
            <div className="min-w-0 space-y-1 text-xs leading-relaxed"><p className="text-muted-foreground"><span className="text-foreground">Today · </span>{source.baseline}</p><p className="text-muted-foreground"><span className="text-signal">Opportunity · </span>{source.opportunity}</p></div>
          </div>)}</div>
        </div>)}
      </section>
      <section className="mt-8 border-t border-border pt-7" aria-labelledby="roadmap-heading">
        <h3 id="roadmap-heading" className="font-display text-2xl text-foreground">Production scaling & deployment roadmap</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">A proposed sequence, not a commitment or a claim of clinical readiness.</p>
        <ol className="mt-4 border-l border-border">{scalingPhases.map(phase => <li key={phase.phase} className="relative pb-6 pl-5 last:pb-0"><span className="absolute -left-1 top-1 size-2 rounded-full bg-primary"/><div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="font-mono text-[11px] text-primary">Phase {phase.phase}</span><h4 className="text-sm font-medium text-foreground">{phase.period}</h4><span className="text-[10px] uppercase text-muted-foreground">{phase.status}</span></div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{phase.summary}</p></li>)}</ol>
      </section>
      <section className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
        <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[.15em]">Identifier harmonization</h3>
        Disease and gene records show OMIM, Orphanet, CTD and bioDBnet cross-references in their detail panel. These are demo mappings; re-verify each one at its source. Constellation is an independent hackathon prototype and is not affiliated with or endorsed by NIH or NCATS.
      </section>
    </DialogContent>
  </Dialog>;
}
