import { useMemo, useState } from 'react';
import { Check, Copy, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { buildDossier, type DossierScope } from '@/lib/frontier';
import { useDossierQueue } from '@/lib/repurposing';

export function DossierButton({ scope, className = '' }: { scope: DossierScope; className?: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const queue = useDossierQueue();
  const text = useMemo(() => open ? buildDossier(scope, queue) : '', [open, scope, queue]);
  const slug = scope.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const download = (ext: 'md' | 'txt') => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown' }));
    const a = document.createElement('a'); a.href = url; a.download = `constellation-dossier-${slug}.${ext}`; a.click(); URL.revokeObjectURL(url);
  };
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); };
  return <>
    <Button variant="outline" onClick={() => setOpen(true)} className={`h-9 gap-2 rounded-sm text-xs ${className}`}><FileText className="size-3.5" /> Generate dossier{queue.length > 0 && ` · +${queue.length} compound${queue.length>1?'s':''}`}</Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-hidden rounded-sm border-border bg-background p-0">
        <DialogHeader className="border-b border-border p-5 text-left">
          <DialogTitle className="font-display text-2xl">Research dossier · {scope.label}</DialogTitle>
          <DialogDescription className="text-xs">Grant and IRB briefing draft built from the demo atlas. Verify every citation before use.</DialogDescription>
          <div className="flex flex-wrap gap-2 pt-3">
            <Button size="sm" onClick={copy} className="rounded-sm text-xs">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? 'Copied' : 'Copy'}</Button>
            <Button size="sm" variant="outline" onClick={() => download('md')} className="rounded-sm text-xs"><Download className="size-3.5" /> Markdown</Button>
            <Button size="sm" variant="outline" onClick={() => window.print()} className="rounded-sm text-xs"><FileText className="size-3.5" /> Print / PDF</Button>
          </div>
        </DialogHeader>
        <pre aria-label="Dossier content" className="dossier-print max-h-[60vh] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-[11px] leading-relaxed text-foreground">{text}</pre>
      </DialogContent>
    </Dialog>
  </>;
}
