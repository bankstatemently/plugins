# Bankstatemently MCP Plugin

Parse and query bank statements via the [Bankstatemently](https://bankstatemently.com) MCP server.

The server is live at `https://api.bankstatemently.com/mcp` (streamable HTTP). Two ways to authenticate: browser sign-in (OAuth, interactive — Claude Code, claude.ai, ChatGPT, and Codex all support this) or an API key (genuinely headless setups: CI, scripts). The API-key lane is permanent — it stays available regardless of OAuth.

## OAuth (browser sign-in)

For an interactive install with no key to copy/paste — the server advertises OAuth discovery metadata (`/.well-known/oauth-protected-resource/mcp`, `/.well-known/oauth-authorization-server`) and Clerk acts as the authorization server.

Enable the `bankstatemently-oauth` server variant after installing the plugin, or install it directly:

```bash
claude mcp add --transport http bankstatemently https://api.bankstatemently.com/mcp
```

Claude Code detects the 401 + `WWW-Authenticate` challenge, discovers the authorization server, registers a client (Dynamic Client Registration), and opens a browser for you to sign in. Credits are debited from the signed-in user's account.

## Getting an API key (genuinely headless setups: CI, scripts)

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

> Auth note: the server reads the key from `X-API-Key` only. Sending it via `Authorization: Bearer` will be rejected. This is unchanged by OAuth — API-key and OAuth are separate, coexisting auth paths (see the OAuth section above for the browser-sign-in alternative).

---

## Codex

Codex has native OAuth support. This one command detects our server's discovery metadata and opens your browser to sign in — no key is ever stored:

```bash
codex mcp add bankstatemently --url https://api.bankstatemently.com/mcp
```

For headless or CI setups where a browser sign-in isn't possible, use an API key via the [mcp-remote](https://github.com/geelen/mcp-remote) bridge instead. Export the key in the shell that launches Codex, before it starts:

```bash
export BANKSTATEMENTLY_API_KEY=bsk_live_...

codex mcp add bankstatemently -- npx -y mcp-remote@latest https://api.bankstatemently.com/mcp --header "X-API-Key: ${BANKSTATEMENTLY_API_KEY}"
```

Codex doesn't yet surface plugin-declared MCP servers into sessions, so the plugin install above (and its bundled skill) isn't available in Codex today — use the commands above instead.

**Credential managers & sandboxed clients:** never fetch a secret from Keychain, 1Password, or another credential manager inside the MCP server command itself — Codex runs that command sandboxed at tool discovery, so a credential-manager lookup dies silently and the server's tools never appear. Export the key in the shell that launches Codex instead. Also note that `mcp-remote` logs its resolved header values to stderr, so a wrapper-resolved key can end up in your client logs.

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
