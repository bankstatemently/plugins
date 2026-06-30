# Bankstatemently MCP Plugin

Parse and query bank statements via the [Bankstatemently](https://bankstatemently.com) MCP server.

The server is live at `https://api.bankstatemently.com/mcp` (streamable HTTP, API-key auth).

## Getting an API key

Create a key at the [Bankstatemently Developer Portal](https://bankstatemently.com/developer). Keys start with `bsk_live_`.

---

## Install via Claude Code marketplace

```bash
/plugin marketplace add bankstatemently/plugins
/plugin install bankstatemently-mcp@bankstatemently
```

After installing, enable the plugin and paste your `bsk_live_...` key when prompted for `api_key`.

> **Dev install (local checkout):** `cd` to the repo root and run `/plugin marketplace add .`, then `/plugin install bankstatemently-mcp`.

---

## Direct install (no plugin, no marketplace)

Add the MCP server directly with the Claude Code CLI:

```bash
claude mcp add --transport http bankstatemently https://api.bankstatemently.com/mcp \
  --header "X-API-Key: <your-bsk_live_key>"
```

> Auth note: the server reads the key from `X-API-Key` only. Sending it via `Authorization: Bearer` will be rejected.

---

## Codex

Codex supports only stdio-based MCP servers. Use [mcp-remote](https://github.com/geelen/mcp-remote) as a bridge.

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.bankstatemently]
command = "npx"
args = ["-y", "mcp-remote", "https://api.bankstatemently.com/mcp", "--header", "X-API-Key: ${BANKSTATEMENTLY_API_KEY}"]
```

Set the environment variable before running Codex:

```bash
export BANKSTATEMENTLY_API_KEY=bsk_live_...
```

---

## Tools

<!-- TOOLS_TABLE_START -->
| Tool | Description | Credits |
|---|---|---|
| `parse_statement` | Parse a bank statement PDF and extract structured financial data. Accepts either a base64-encoded PDF or a URL to fetch. Returns accounts, transactions, and metadata. Consumes credits (1 per page). Page limit depends on your plan. | 1 per page |
| `get_statement` | Fetch the full parsed data for a previously processed document. Use this after parse_statement returns a "processing" status, or to re-fetch results. | Free |
| `list_statements` | Browse your previously parsed bank statements with pagination and optional status filter. | Free |
| `get_credits` | Check your current credit balance. 1 credit = 1 page of bank statement processing. | Free |
| `evaluate_benchmark` | Score parsed bank statement transactions against the Bankstatemently benchmark ground truth. Accepts a statement_id (e.g. "bsb-001") or content_hash, plus your parsed transactions. Returns extraction accuracy, integrity score, and an overall score. Free to use — no credits consumed. Read the benchmark://catalog resource first to see available statements. | Free |
<!-- TOOLS_TABLE_END -->

Call `get_credits` before a large `parse_statement` to confirm sufficient balance.
