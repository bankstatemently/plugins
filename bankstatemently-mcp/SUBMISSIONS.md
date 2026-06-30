# MCP Directory Submission Kit

Canonical blurb and per-directory steps for listing the Bankstatemently MCP server
in public directories. Steps marked **USER-RUN** require interactive browser auth or
a form — they cannot be automated and must be performed by the maintainer.

---

## Canonical blurb

| Field | Value |
|---|---|
| **Name** | Bankstatemently |
| **Description** | Parse and query bank statements — turn PDF statements into structured transactions, accounts, and balances. |
| **Repository** | https://github.com/bankstatemently/plugins |
| **Homepage** | https://bankstatemently.com/developers/mcp |
| **Transport** | Streamable HTTP (remote) |
| **Auth** | API key via `X-API-Key` header (`bsk_live_...`) |
| **Tools** | See `MCP_TOOL_DEFS` in `packages/backend/src/routes/mcp/toolDefs.ts` for the canonical tool list (name, title, description, credit cost). Do not copy-paste a hand-maintained list here — read the source. |

Config snippet (Claude Code marketplace):

```bash
/plugin marketplace add bankstatemently/plugins
/plugin install bankstatemently-mcp@bankstatemently
```

---

## Version note

`server.json` carries a `version` field. Keep it in sync with the `version` in
`plugins/bankstatemently-mcp/plugin.json` — bump both together on any breaking
change.

---

## Per-directory submission steps

### 1. Official MCP registry (the keystone — Glama and others ingest from it)

> **USER-RUN** — requires GitHub OAuth as the `bankstatemently` org.

The `server.json` at the public repo root is the submission artifact.
`publish-plugin.sh` keeps it in sync.

```bash
# Install the publisher CLI (once)
npm install -g mcp-publisher

# Authenticate as the bankstatemently GitHub org (browser device-flow)
mcp-publisher login github

# Clone the public repo and publish
git clone https://github.com/bankstatemently/plugins /tmp/bs-plugins
cd /tmp/bs-plugins
mcp-publisher publish
```

The namespace `io.github.bankstatemently/*` is reserved for the `bankstatemently`
GitHub org — no DNS or manual approval needed, just the GitHub auth above.

Docs: https://modelcontextprotocol.io/registry/quickstart

---

### 2. Glama

> Auto-indexes GitHub repos and the MCP registry — no manual submission needed
> once the registry listing is live (step 1).

If the listing doesn't appear within 24 hours, claim it manually at
https://glama.ai — search for the repo and click "Claim listing".

---

### 3. mcp.so

> **USER-RUN** — GitHub PR or Submit button.

1. Go to https://mcp.so and click **Submit**.
2. Paste the repo URL: `https://github.com/bankstatemently/plugins`
3. Fill in the canonical blurb fields above.

Alternatively, open a PR to their listing repo if they accept community
submissions (check their repo for a `servers/` or `listings/` directory).

---

### 4. PulseMCP

> **USER-RUN** — web form (supports remote MCP servers).

1. Go to https://pulsemcp.com and click **Submit a server**.
2. Fill in the canonical blurb fields above.
3. Under Transport, select **Streamable HTTP (remote)** and enter
   `https://api.bankstatemently.com/mcp`.

---

### 5. Smithery

> **USER-RUN** — CLI or web.

```bash
# Install the Smithery CLI (once)
npm install -g @smithery/cli

# Publish using the remote MCP URL
smithery mcp publish https://api.bankstatemently.com/mcp
```

Note: Smithery is oriented toward hosted/packaged servers; the remote URL path
is accepted but may require additional metadata via their web form. Check
https://smithery.ai/docs for the current recommended flow.

---

### 6. awesome-mcp-servers (punkpeye)

> **USER-RUN** — GitHub PR to https://github.com/punkpeye/awesome-mcp-servers.

1. Fork the repo.
2. Add an entry under the **Finance** (or closest matching) section:
   ```
   - [Bankstatemently](https://github.com/bankstatemently/plugins) — Parse and query bank statements — turn PDF statements into structured transactions, accounts, and balances. `streamable-http` `api-key`
   ```
3. Open a PR against their `main` branch.
