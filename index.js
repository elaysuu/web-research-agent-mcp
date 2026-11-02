#!/usr/bin/env node
// Thin MCP wrapper. Two modes:
//  - RapidAPI mode (default): set RAPIDAPI_KEY to your own RapidAPI key (Free plan available).
//  - Direct mode (hosted deployments, e.g. MCPize pay-per-call): set WRA_DIRECT_TOKEN (WRA_DIRECT_URL optional).
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
const HOST = process.env.RAPIDAPI_HOST || 'web-research-agent-api.p.rapidapi.com';
const KEY = process.env.RAPIDAPI_KEY;
const DURL = (process.env.WRA_DIRECT_URL || 'https://web-research-agent-api.elayosetrov78.workers.dev').replace(/\/+$/, '');
const DTOK = process.env.WRA_DIRECT_TOKEN;
const DIRECT = !!(DURL && DTOK);
async function call(path, params, post = false) {
  if (!DIRECT && !KEY) return { content: [{ type: 'text', text: 'RAPIDAPI_KEY is not set. Get a free key: subscribe to "Web Research Agent API" on RapidAPI.' }], isError: true };
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
  const auth = DIRECT ? { 'x-wra-token': DTOK } : { 'x-rapidapi-key': KEY, 'x-rapidapi-host': HOST };
  const base = DIRECT ? `${DURL}${path}` : `https://${HOST}${path}`;
  const r = post
    ? await fetch(base, { method: 'POST', headers: { ...auth, 'content-type': 'application/json' }, body: JSON.stringify(params) })
    : await fetch(`${base}?${qs}`, { headers: auth });
  const t = await r.text();
  return { content: [{ type: 'text', text: t }], isError: !r.ok };
}
const s = new McpServer({ name: 'web-research-agent', version: '0.3.0' });
s.tool('company_profile', 'Research a company from its website: name, description, socials, emails, key pages, pricing mentions, tech stack.', { url: z.string().describe('Company website, e.g. stripe.com') }, a => call('/company-profile', a));
s.tool('site_audit', 'Audit a web page: SEO, performance hints, security headers, broken internal links; returns score 0-100 and issues.', { url: z.string(), max_links: z.number().int().min(0).max(25).optional() }, a => call('/site-audit', a));
s.tool('page_to_json', 'Fetch a web page and return structured JSON: meta, Open Graph, JSON-LD, headings, links, images, clean text.', { url: z.string(), max_text: z.number().int().min(0).max(100000).optional() }, a => call('/page-to-json', a));
s.tool('email_check', 'Validate an email address or domain via live DNS: syntax, MX/null-MX, SPF, DMARC policy, disposable/free/role flags, deliverability verdict and 0-100 score. No SMTP probe.', { email: z.string().optional().describe('Email address to check'), domain: z.string().optional().describe('Or a domain, e.g. stripe.com') }, a => call('/email-check', a));
s.tool('sitemap_urls', "List a site's URLs from its sitemaps (robots.txt Sitemap: lines, nested indexes, text sitemaps) with lastmod/changefreq/priority; optional since date filter.", { url: z.string().describe('Site or sitemap URL'), limit: z.number().int().min(1).max(5000).optional(), max_sitemaps: z.number().int().min(1).max(10).optional(), since: z.string().optional().describe('ISO date; only URLs with lastmod >= since') }, a => call('/sitemap-urls', a));
s.tool('page_diff', 'Monitor a page for changes: returns normalized text + SHA-256 content_hash; pass previous_text (or previous_hash) from an earlier call to get changed flag and added/removed lines.', { url: z.string(), previous_text: z.string().max(250000).optional(), previous_hash: z.string().optional(), selector: z.string().optional().describe('Optional #id to limit to one element') }, a => call('/page-diff', a, true));
await s.connect(new StdioServerTransport());
