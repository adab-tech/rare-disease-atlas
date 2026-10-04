import { useEffect, useMemo, useRef, useState } from 'react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';
import { LocateFixed, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { edges, nodes, type AtlasNode } from '@/lib/atlas-data';
import { disputeByEdge } from '@/lib/frontier';

type Point = SimulationNodeDatum & { id: string; x: number; y: number; cluster: string; type: string };
type Props = { selectedNode: string | null; selectedEdge: string | null; onNode: (id: string) => void; onEdge: (id: string) => void; focusCluster: string | null; phenotypeIds?: string[] };
const starfield = Array.from({ length: 110 }, (_, i) => ({ x: ((i * 419 + 127) % 1000) - 500, y: ((i * 233 + 59) % 620) - 310, r: i % 11 === 0 ? 1.15 : .55, opacity: i % 7 === 0 ? .48 : .18 }));
const radius = (node: AtlasNode) => node.type === 'mechanism' ? 13 : node.type === 'disease' ? 10 : node.type === 'gene' ? 6 : node.type === 'organization' ? 5 : 3.7;
const visibleLabel = (node: AtlasNode, selected: boolean, nearby: boolean) => selected || nearby || ['mechanism','disease'].includes(node.type);

export function AtlasGraph({ selectedNode, selectedEdge, onNode, onEdge, focusCluster, phenotypeIds = [] }: Props) {
  const [positions, setPositions] = useState<Record<string, {x:number;y:number}>>({});
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pan = useRef<{ x: number; y: number; startX: number; startY: number; moved: boolean } | null>(null);
  const related = useMemo(() => new Set(selectedNode ? [selectedNode, ...edges.filter(edge => edge.source === selectedNode || edge.target === selectedNode).map(edge => edge.source === selectedNode ? edge.target : edge.source)] : []), [selectedNode]);

  useEffect(() => {
    const graphNodes: Point[] = nodes.map((node, index) => ({ id: node.id, cluster: node.cluster, type: node.type, x: (node.cluster === 'clearance' ? -225 : 225) + Math.cos(index * 2.399) * 85, y: Math.sin(index * 2.399) * 120 }));
    const simulation = forceSimulation(graphNodes)
      .force('link', forceLink<Point, {source:string;target:string}>(edges.map(edge => ({ source: edge.source, target: edge.target }))).id(d => d.id).distance(link => {
        const source = typeof link.source === 'string' ? graphNodes.find(n => n.id === link.source) : link.source;
        const target = typeof link.target === 'string' ? graphNodes.find(n => n.id === link.target) : link.target;
        if (!source || !target) return 70;
        return source.type === 'mechanism' || target.type === 'mechanism' ? 94 : 67;
      }).strength(.38))
      .force('charge', forceManyBody<Point>().strength(-75))
      .force('collide', forceCollide<Point>().radius(d => d.type === 'disease' || d.type === 'mechanism' ? 36 : 18))
      .force('x', forceX<Point>().x(d => d.cluster === 'clearance' ? -225 : 225).strength(.12))
      .force('y', forceY<Point>().y(0).strength(.07))
      .force('center', forceCenter(0,0))
      .alphaDecay(.035)
      .on('tick', () => setPositions(Object.fromEntries(graphNodes.map(n => [n.id, { x: n.x, y: n.y }]))));
    return () => { simulation.stop(); };
  }, []);

  useEffect(() => {
    if (!selectedNode || !positions[selectedNode]) return;
    const point = positions[selectedNode];
    setTransform(t => ({ ...t, x: Math.max(-240, Math.min(240, -point.x * t.k * .38)), y: Math.max(-100, Math.min(100, -point.y * t.k * .35)) }));
  }, [selectedNode]); // selection moves the map; simulation position changes should not repeatedly recenter

  const zoom = (factor: number) => setTransform(t => ({ ...t, k: Math.max(.65, Math.min(2.5, t.k * factor)) }));
  const onWheel = (event: React.WheelEvent<SVGSVGElement>) => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.12 : .89); };
  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target !== svgRef.current && !(event.target as Element).classList.contains('graph-background')) return;
    pan.current = { x: event.clientX, y: event.clientY, startX: transform.x, startY: transform.y, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!pan.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = (event.clientX - pan.current.x) * 1000 / rect.width;
    const dy = (event.clientY - pan.current.y) * 640 / rect.height;
    if (Math.abs(dx) + Math.abs(dy) > 3) pan.current.moved = true;
    setTransform(t => ({ ...t, x: pan.current ? pan.current.startX + dx : t.x, y: pan.current ? pan.current.startY + dy : t.y }));
  };
  return <div className="relative h-full min-h-[470px] overflow-hidden bg-skyfield md:min-h-[580px]" aria-label="Interactive rare disease knowledge graph">
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-skyfield to-transparent" />
    <svg ref={svgRef} viewBox="-500 -320 1000 640" preserveAspectRatio="xMidYMid meet" className="h-full w-full touch-none cursor-grab active:cursor-grabbing" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={() => { pan.current = null; }}>
      <defs>
        <radialGradient id="clearance-halo"><stop stopColor="var(--clearance)" stopOpacity=".32"/><stop offset="1" stopColor="var(--clearance)" stopOpacity="0"/></radialGradient>
        <radialGradient id="channel-halo"><stop stopColor="var(--channel)" stopOpacity=".28"/><stop offset="1" stopColor="var(--channel)" stopOpacity="0"/></radialGradient>
        <filter id="star-glow" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect className="graph-background" x="-500" y="-320" width="1000" height="640" fill="transparent" />
      {starfield.map((s,i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--starlight)" opacity={s.opacity} className="pointer-events-none" />)}
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
        <circle cx="-225" cy="0" r="232" fill="url(#clearance-halo)" className="pointer-events-none" />
        <circle cx="225" cy="0" r="232" fill="url(#channel-halo)" className="pointer-events-none" />
        {edges.map(edge => {
          const a = positions[edge.source], b = positions[edge.target]; if (!a || !b) return null;
          const active = selectedEdge === edge.id || (!!selectedNode && (edge.source === selectedNode || edge.target === selectedNode));
          const muted = (!!selectedNode && !active) || (!!focusCluster && (nodes.find(n => n.id === edge.source)?.cluster !== focusCluster || nodes.find(n => n.id === edge.target)?.cluster !== focusCluster));
          return <g key={edge.id} className="cursor-pointer" onClick={() => onEdge(edge.id)}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={disputeByEdge[edge.id] ? 'var(--warning)' : active ? 'var(--starlight)' : 'var(--graph-line)'} strokeWidth={active ? 1.5 : disputeByEdge[edge.id] ? 1.1 : .7} opacity={muted ? .1 : active ? .85 : disputeByEdge[edge.id] ? .7 : .38} strokeDasharray={edge.status === 'Inferred' ? '3 4' : undefined} className="pointer-events-none transition-opacity duration-300" />
            {disputeByEdge[edge.id] && <g transform={`translate(${(a.x+b.x)/2} ${(a.y+b.y)/2})`} className="pointer-events-none" opacity={muted ? .15 : 1}><circle r="6" fill="var(--skyfield)" stroke="var(--warning)" strokeWidth="1"/><text y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--warning)">!</text></g>}<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="11" aria-label={`${nodes.find(n => n.id === edge.source)?.label} ${edge.relation} ${nodes.find(n => n.id === edge.target)?.label}`}><title>{edge.relation} · {edge.confidence.toFixed(2)} confidence{disputeByEdge[edge.id] ? ' · contested evidence' : ''}</title></line>
          </g>;
        })}
        {nodes.map(node => {
          const p = positions[node.id]; if (!p) return null;
           const selected = selectedNode === node.id; const nearby = related.has(node.id); const profiled = phenotypeIds.includes(node.id); const active = selected || hovered === node.id || profiled;
          const dim = (!!selectedNode && !nearby) || (!!focusCluster && node.cluster !== focusCluster);
          const r = radius(node);
          return <g key={node.id} transform={`translate(${p.x} ${p.y})`} onClick={() => onNode(node.id)} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} className="cursor-pointer transition-opacity duration-300" opacity={dim ? .2 : 1} role="button" tabIndex={0} aria-label={`Explore ${node.label}`} onKeyDown={ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onNode(node.id); } }}>
            <circle r={r * (active ? 3.8 : 2.9)} fill={node.cluster === 'clearance' ? 'var(--clearance)' : 'var(--channel)'} opacity={active ? .25 : .13} filter="url(#star-glow)" />
             <circle r={r + (active ? 9 : 5)} fill="none" stroke={profiled ? 'var(--starlight)' : node.cluster === 'clearance' ? 'var(--clearance)' : 'var(--channel)'} opacity={active ? .8 : node.type === 'disease' || node.type === 'mechanism' ? .16 : 0} strokeWidth={profiled ? 1.8 : .6} strokeDasharray={profiled ? '3 2' : undefined} />
            <circle r={r} fill={node.cluster === 'clearance' ? 'var(--clearance)' : 'var(--channel)'} stroke={active ? 'var(--starlight)' : 'none'} strokeWidth="1.5" />
            <circle r="18" fill="transparent" />
             {(profiled || visibleLabel(node, selected, nearby || hovered === node.id)) && <text x={r + 10} y="4" fill={selected || profiled ? 'var(--starlight)' : 'var(--graph-label)'} fontSize={node.type === 'disease' || node.type === 'mechanism' ? 12 : 10} fontWeight={selected || profiled ? 600 : 400} className="pointer-events-none select-none">{node.label}</text>}
          </g>;
        })}
      </g>
    </svg>
    <div className="absolute bottom-5 right-5 z-10 flex flex-col gap-1 border border-border/60 bg-skyfield/90 p-1 backdrop-blur-sm">
      <Button variant="ghost" size="icon" onClick={() => zoom(1.25)} aria-label="Zoom in" title="Zoom in"><Plus /></Button>
      <Button variant="ghost" size="icon" onClick={() => zoom(.8)} aria-label="Zoom out" title="Zoom out"><Minus /></Button>
      <Button variant="ghost" size="icon" onClick={() => setTransform({x:0,y:0,k:1})} aria-label="Reset map" title="Reset map"><LocateFixed /></Button>
    </div>
    <div className="absolute bottom-5 left-5 pointer-events-none text-[10px] uppercase tracking-[.2em] text-muted-foreground">Drag to pan <span className="mx-2 opacity-40">·</span> Scroll to zoom</div>
  </div>;
}
