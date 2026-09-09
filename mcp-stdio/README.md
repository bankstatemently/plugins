# @bankstatemently/mcp

Self-contained stdio MCP server for [Bankstatemently](https://bankstatemently.com) — convert bank statement PDFs into structured transactions, accounts, and balances.

Every tool call is forwarded to the public Bankstatemently API (`POST https://api.bankstatemently.com/v1/tools/:name`) — this package carries no Bankstatemently-specific code beyond the generated `tool-definitions.json`.

## Run

```bash
npm install --omit=dev
BANKSTATEMENTLY_API_KEY=bsk_live_... node dist/stdio.js
```

Get an API key at [bankstatemently.com/developer](https://bankstatemently.com/developer).

`BANKSTATEMENTLY_API_KEY` is optional at startup: `initialize`/`tools/list` answer with no network call either way, so an uncredentialed probe still sees the full tool list. A `tools/call` with no key returns the same auth-required result the hosted server returns.

## Configuration

| Env var | Required | Description |
|---|---|---|
| `BANKSTATEMENTLY_API_KEY` | No | Your API key (`bsk_live_...`). Needed for `tools/call`, not for `initialize`/`tools/list`. |
| `BANKSTATEMENTLY_API_URL` | No | Overrides the API base URL. Defaults to `https://api.bankstatemently.com`. |

## Build

```bash
npm install
npm run build
```
