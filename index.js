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
async function call(path, params) {
  if (!DIRECT && !KEY) return { content: [{ type: 'text', text: 'RAPIDAPI_KEY is not set. Get a free key: subscribe to "Web Research Agent API" on RapidAPI.' }], isError: true };
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]));
  const r = DIRECT
    ? await fetch(`${DURL}${path}?${qs}`, { headers: { 'x-wra-token': DTOK } })
    : await fetch(`https://${HOST}${path}?${qs}`, { headers: { 'x-rapidapi-key': KEY, 'x-rapidapi-host': HOST } });
  const t = await r.text();
  return { content: [{ type: 'text', text: t }], isError: !r.ok };
}
const s = new McpServer({ name: 'web-research-agent', version: '0.2.0' });
s.tool('company_profile', 'Research a company from its website: name, description, socials, emails, key pages, pricing mentions, tech stack.', { url: z.string().describe('Company website, e.g. stripe.com') }, a => call('/company-profile', a));
s.tool('site_audit', 'Audit a web page: SEO, performance hints, security headers, broken internal links; returns score 0-100 and issues.', { url: z.string(), max_links: z.number().int().min(0).max(25).optional() }, a => call('/site-audit', a));
s.tool('page_to_json', 'Fetch a web page and return structured JSON: meta, Open Graph, JSON-LD, headings, links, images, clean text.', { url: z.string(), max_text: z.number().int().min(0).max(100000).optional() }, a => call('/page-to-json', a));
await s.connect(new StdioServerTransport());
