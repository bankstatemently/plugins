# bankstatemently/plugins

[![plugins MCP server](https://glama.ai/mcp/servers/bankstatemently/plugins/badges/card.svg)](https://glama.ai/mcp/servers/bankstatemently/plugins)

Marketplace plugins for [Bankstatemently](https://bankstatemently.com) — convert bank statements.

## Install via Claude Code marketplace

```bash
/plugin marketplace add bankstatemently/plugins
/plugin install bankstatemently@bankstatemently
```

After installing, enable the plugin. The first tool call opens your browser to sign in; the plugin asks for no settings.

For a headless setup (CI, scripts), skip the plugin and add the server directly with an API key — see below. Get a key at [bankstatemently.com/developer](https://bankstatemently.com/developer).

## Plugins

- **[bankstatemently](./bankstatemently/)** — MCP server for converting bank statements.
  Convert PDFs, list statements, check credits, run benchmark evaluations.

## Claude Code direct install (no plugin)

Add the hosted MCP server directly and sign in with your browser:

```bash
claude mcp add --transport http bankstatemently https://api.bankstatemently.com/mcp
```

For a headless setup, pass an API key in the `X-API-Key` header instead (the server rejects `Authorization: Bearer`):

```bash
claude mcp add --transport http bankstatemently https://api.bankstatemently.com/mcp \
  --header "X-API-Key: <your-bsk_live_key>"
```

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

## Run over stdio

For stdio-only clients (Claude Desktop's config file, Cursor, headless
setups) or a directory scanner that launches the server locally, clone the
public repo and run the self-contained `mcp-stdio` server directly — no
Docker, no bridge process:

```bash
git clone https://github.com/bankstatemently/plugins.git
cd plugins/mcp-stdio
npm install --omit=dev
BANKSTATEMENTLY_API_KEY=bsk_live_... node dist/stdio.js
```

`BANKSTATEMENTLY_API_KEY` is optional at startup: `initialize`/`tools/list`
answer with no network call and no key either way, so an uncredentialed
directory probe still sees the full tool list. A `tools/call` with no key
returns the same auth-required result the hosted server returns. Export the
key in the shell or runtime environment that launches the process — never
resolve it inside the MCP command (a credential-manager lookup inside a
sandboxed client's command dies silently, same caveat as the Codex section
above).
