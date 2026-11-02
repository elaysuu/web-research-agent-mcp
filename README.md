# web-research-agent-mcp
MCP server that gives Claude, Cursor or any MCP client three research tools: `company_profile`, `site_audit` and `page_to_json`.
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

The crawler respects robots.txt and refuses private and internal addresses. MIT license.

## Hosted / pay-per-call
Also available hosted on [MCPize](https://mcpize.com) with pay-per-call pricing (no RapidAPI key needed). Self-hosters of the backend can use direct mode with env `WRA_DIRECT_URL` and `WRA_DIRECT_TOKEN`.
