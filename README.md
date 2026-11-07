# web-research-agent-mcp

[![M8ven Verified](https://m8ven.ai/badge/mcp/elaysuu-web-research-agent-mcp-131b0f?variant=verified)](https://m8ven.ai/mcp/elaysuu-web-research-agent-mcp-131b0f?s=readme)

MCP server that gives Claude, Cursor or any MCP client six research tools: `company_profile`, `site_audit`, `page_to_json`, `email_check`, `sitemap_urls` and `page_diff`.
It is backed by the [Web Research Agent API](https://rapidapi.com/Elayosetrov/api/web-research-agent-api) on RapidAPI. **You need your own RapidAPI key.** The free plan gives you 50 calls/month.

## Setup
1. Subscribe on RapidAPI (Free plan) and copy your `X-RapidAPI-Key`.
2. Add the server to your MCP config:
```json
{ "mcpServers": { "web-research-agent": { "command": "npx", "args": ["-y", "github:elaysuu/web-research-agent-mcp"], "env": { "RAPIDAPI_KEY": "YOUR_KEY" } } } }
```
## Tools
- `company_profile(url)`: name, description, logo, socials, emails, key pages, price mentions, tech stack.
- `site_audit(url, max_links?)`: 0–100 score, SEO, performance, security-header and broken-link issues.
- `page_to_json(url, max_text?)`: meta, OG, JSON-LD, headings, links, images, clean text.
- `email_check(email? | domain?)`: syntax, MX/null-MX, SPF, DMARC policy, disposable/free/role flags, verdict and 0–100 score (live DNS, no SMTP probe).
- `sitemap_urls(url, limit?, max_sitemaps?, since?)`: every URL a site publishes in its sitemaps, with lastmod; `since` returns only changed pages.
- `page_diff(url, previous_text? | previous_hash?, selector?)`: content hash plus added/removed lines since your last check — a stateless change monitor.

The crawler respects robots.txt and refuses private and internal addresses. MIT license.

## Hosted / pay-per-call
Also available hosted on [MCPize](https://mcpize.com) with pay-per-call pricing (no RapidAPI key needed). Self-hosters of the backend can use direct mode with env `WRA_DIRECT_URL` and `WRA_DIRECT_TOKEN`.

## Also by the author

- [AI Agent Prompt Pack](https://payhip.com/b/6JvM8?utm_source=github&utm_medium=readme&utm_campaign=web-research-agent-mcp): prompts for research and tool-using agents (source citing, fact-checking, guardrails). $9 on Payhip, or 9 USDC on Base at [Setrov Store](https://setrov-store.elayosetrov78.workers.dev).
- Other products (game textures, kids printables): [Setrov Studio on Payhip](https://payhip.com/SetrovStudio?utm_source=github&utm_medium=readme&utm_campaign=web-research-agent-mcp).
