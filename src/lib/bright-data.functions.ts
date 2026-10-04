import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

type RecordItem = { title: string; detail: string; url: string; source: string; mode: 'live' | 'official' | 'fallback' };
export type Enrichment = { query: string; registries: RecordItem[]; trials: RecordItem[]; awardees: RecordItem[]; fetchedAt: string; notice: string };
const TERMS = ['Niemann-Pick type C', 'Gaucher disease', 'Fabry disease', 'Dravet syndrome', 'SCN2A', 'SCN8A', 'KCNQ2'] as const;
const registrySources: Record<string, { name: string; url: string }> = {
  'Niemann-Pick type C': { name: 'National Niemann-Pick Disease Foundation', url: 'https://nnpdf.org/' },
  'Gaucher disease': { name: 'National Gaucher Foundation', url: 'https://www.gaucherdisease.org/' },
  'Dravet syndrome': { name: 'Dravet Syndrome Foundation', url: 'https://dravetfoundation.org/' },
  SCN2A: { name: 'FamilieSCN2A Foundation', url: 'https://www.scn2a.org/' },
};
const safeText = (s: unknown, length = 140) => typeof s === 'string' ? s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, length) : '';
const safeURL = (url: string, origin: string) => { try { const u = new URL(url, origin); return u.protocol === 'https:' && u.hostname === new URL(origin).hostname ? u.href : ''; } catch { return ''; } };
async function throughBrightData(url: string, key: string, zone: string): Promise<string> {
  const response = await fetch('https://api.brightdata.com/request', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ zone, url, format: 'raw' }), signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Bright Data returned ${response.status}`);
  const text = await response.text();
  if (!text || /Residential Failed|bad_endpoint|robots.txt|Access Denied/i.test(text.slice(0, 800))) throw new Error('Source unavailable through Bright Data');
  return text;
}
function registryLinks(html: string, origin: string, name: string): RecordItem[] {
  const results: RecordItem[] = [];
  const anchors = html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const match of anchors) {
    const title = safeText(match[2]);
    if (!/registr(y|ies|ation)/i.test(title) || /register for|doctor registration|sign up/i.test(title)) continue;
    const url = safeURL(match[1] ?? '', origin);
    if (url && !results.some(r => r.url === url)) results.push({ title, detail: `Listed by ${name}. Access and eligibility require confirmation.`, url, source: name, mode: 'live' });
    if (results.length >= 3) break;
  }
  return results;
}
export const getEnrichment = createServerFn({ method: 'POST' })
  .inputValidator((input) => z.object({ term: z.enum(TERMS) }).parse(input))
  .handler(async ({ data }): Promise<Enrichment> => {
    const term = data.term;
    const key = process.env['BRIGHT_DATA_API_KEY'];
    const zone = process.env['BRIGHT_DATA_ZONE'] || 'web_unlocker_adabtech';
    const source = registrySources[term];
    const fallbackRegistry: RecordItem[] = source ? [{ title: source.name, detail: 'Known patient community; registry access and availability unverified.', url: source.url, source: 'Curated demo directory', mode: 'fallback' }] : [];
    const [registries, trials, awardees] = await Promise.all([
      (async () => {
        if (!key || !source) return fallbackRegistry;
        try { const html = await throughBrightData(source.url, key, zone); const links = registryLinks(html, source.url, source.name); return links.length ? links : fallbackRegistry; }
        catch { return fallbackRegistry; }
      })(),
      (async (): Promise<RecordItem[]> => {
        const params = new URLSearchParams({ 'query.term': term, 'filter.overallStatus': 'RECRUITING,ACTIVE_NOT_RECRUITING', pageSize: '5', format: 'json' });
        const url = `https://clinicaltrials.gov/api/v2/studies?${params}`;
        try {
          let text = '';
          let mode: 'live' | 'official' = 'live';
          if (key) { try { text = await throughBrightData(url, key, zone); JSON.parse(text); } catch { text = ''; mode = 'official'; } }
          if (!text) { const response = await fetch(url, { signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error('Trials feed unavailable'); text = await response.text(); mode = 'official'; }
          const payload = JSON.parse(text) as { studies?: Array<{ protocolSection?: { identificationModule?: { nctId?: string; briefTitle?: string }; statusModule?: { overallStatus?: string }; contactsLocationsModule?: { locations?: Array<{ facility?: string; city?: string; country?: string }> } } }> };
          return (payload.studies ?? []).flatMap(study => { const p = study.protocolSection; const id = p?.identificationModule?.nctId; if (!id || !/^NCT\d{8}$/.test(id)) return []; const sites = p?.contactsLocationsModule?.locations?.slice(0,2).map(l => [l.facility,l.city,l.country].filter(Boolean).join(', ')).join(' · ') || 'Sites not listed in this record'; return [{ title: safeText(p?.identificationModule?.briefTitle) || id, detail: `${id} · ${safeText(p?.statusModule?.overallStatus)} · ${safeText(sites, 180)}`, url: `https://clinicaltrials.gov/study/${id}`, source: 'ClinicalTrials.gov', mode }]; });
        } catch { return []; }
      })(),
      (async (): Promise<RecordItem[]> => {
        // NIH RePORTER is a POST-only API; Bright Data's page request is GET-only, so query its official API directly.
        try {
          const response = await fetch('https://api.reporter.nih.gov/v2/projects/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ criteria: { advanced_text_search: { operator: 'and', search_field: 'all', search_text: term } }, offset: 0, limit: 5 }), signal: AbortSignal.timeout(12000) });
          if (!response.ok) throw new Error('NIH feed unavailable');
          const payload = await response.json() as { results?: Array<{ appl_id?: number; project_title?: string; project_num?: string; fiscal_year?: number; organization?: { org_name?: string }; principal_investigators?: Array<{ full_name?: string }> }> };
          return (payload.results ?? []).flatMap(item => item.appl_id ? [{ title: safeText(item.project_title), detail: `${safeText(item.principal_investigators?.map(p => p.full_name).filter(Boolean).join(', ') || 'Investigator not listed')} · ${safeText(item.organization?.org_name)} · FY${item.fiscal_year ?? '—'}`, url: `https://reporter.nih.gov/project-details/${item.appl_id}`, source: 'NIH RePORTER', mode: 'official' as const }] : []);
        } catch { return []; }
      })(),
    ]);
    return { query: term, registries, trials, awardees, fetchedAt: new Date().toISOString(), notice: key ? 'Registry pages use Bright Data where permitted. Blocked study feeds use official public APIs. Source status is shown on each result.' : 'Bright Data is not configured. Public official feeds and curated community links are shown instead.' };
  });
