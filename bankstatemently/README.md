# Bankstatemently MCP Plugin

Convert bank statements via the [Bankstatemently](https://bankstatemently.com) MCP server.

The server is live at `https://api.bankstatemently.com/mcp` (streamable HTTP). Two ways to authenticate: browser sign-in (OAuth, interactive — Claude Code, claude.ai, ChatGPT, and Codex all support this) or an API key (genuinely headless setups: CI, scripts). The API-key lane is permanent — it stays available regardless of OAuth.

## OAuth (browser sign-in)

For an interactive install with no key to copy/paste — the server advertises OAuth discovery metadata (`/.well-known/oauth-protected-resource/mcp`, `/.well-known/oauth-authorization-server`) and Clerk acts as the authorization server.

The plugin's bundled server entry carries no key: install the plugin (below) and sign in when the first tool call opens your browser. Or install the server directly with no key:

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
/plugin install bankstatemently@bankstatemently
```

After installing, enable the plugin. The first tool call opens your browser to sign in (OAuth); nothing to configure.

> **Dev install (local checkout):** `cd` to the repo root and run `/plugin marketplace add .`, then `/plugin install bankstatemently`.

**Try it free:** ask your agent to convert `https://bankstatemently.com/benchmark/statements/bsb-004-statement.pdf` — our published benchmark statement. Benchmark conversions never consume credits.

## Skills

The plugin bundles four OpenAI-format skills (also used as the source for Claude commands):

| Skill | Use it for |
|---|---|
| `convert-statement` | Convert a statement from a file path, attachment, or public PDF URL, then fetch CSV, XLSX, QBO, or Xero exports. |
| `analyze-spending` | Categorize a statement when needed, then group spending by category and merchant, rank top merchants, and build monthly trends. |
| `reconcile-statements` | Review statement coverage, missing periods, balance-continuity breaks, and cross-account transfers. |
| `benchmark-accuracy` | Convert a published Bankstatemently benchmark statement and score it against the benchmark catalog. |

## Commands

The plugin bundles user-invoked commands for common jobs. Each command file is generated from its matching skill — do not edit `commands/*.md` by hand.

| Command | Skill source | Use it for |
|---|---|---|
| `/bankstatemently:convert` | `convert-statement` | Convert a statement from a file path, attachment, or public PDF URL, then fetch CSV, XLSX, QBO, or Xero exports. |
| `/bankstatemently:analyze` | `analyze-spending` | Categorize a statement when needed, then group spending by category and merchant, rank top merchants, and build monthly trends. |
| `/bankstatemently:reconcile` | `reconcile-statements` | Review statement coverage, missing periods, balance-continuity breaks, and cross-account transfers. |
| `/bankstatemently:benchmark` | `benchmark-accuracy` | Convert a published Bankstatemently benchmark statement and score it against the benchmark catalog. |

---

## Direct install (no plugin, no marketplace)

Add the MCP server directly with the Claude Code CLI and sign in with your browser:

```bash
claude mcp add --transport http bankstatemently https://api.bankstatemently.com/mcp
```

For a headless install (CI, scripts), add the server directly with an API key in the `X-API-Key` header instead of the plugin — the command is in the [repository README](https://github.com/bankstatemently/plugins#readme) and on the [developers page](https://bankstatemently.com/developers/mcp).

> Auth note: the server reads an API key from the `X-API-Key` header only. Sending it via `Authorization: Bearer` will be rejected. This is unchanged by OAuth — API-key and OAuth are separate, coexisting auth paths (see the OAuth section above for the browser-sign-in alternative).

## Tools

<!-- TOOLS_TABLE_START -->
| Tool | Description | Credits |
|---|---|---|
| `convert_statement` | Convert a bank statement PDF into structured data or a spreadsheet. | 1 per page |
| `request_upload` | Mint a single-use upload URL for pushing a conversation-attached PDF to Bankstatemently before converting it. | Free |
| `get_statement` | Fetch the full converted data for a previously processed document. | Free |
| `categorize_statement` | Run AI transaction categorization on a previously processed document, then return its category mappings. | Pooled per page (first run only) |
| `list_statements` | Browse your previously converted bank statements with pagination and optional status filter. | Free |
| `dismiss_statement` | Hide a failed, rejected, or cancelled document from future list_statements results. | Free |
| `get_credits` | Your remaining Bankstatemently credits — the processing quota, NOT credit/debit transactions. | Free |
| `rate_statement` | Report how well a previously converted bank statement was parsed: submit a 1-5 rating, optionally with structured feedback (only accepted when the rating is 3 or below) and use-case tags. | Free |
| `list_transactions` | A transaction is a single line as printed on one account's statement — one side of any movement. | Free |
| `aggregate` | Compute a single metric (sum/average/count/max/min) over a filtered set of transactions across your converted statements. | Free |
| `group_by` | Group transactions by a dimension (month/category/merchant/account/currency) and apply a metric to each group. | Free |
| `top_n` | Return the top N groups ranked by metric (descending), per-currency for monetary metrics. | Free |
| `compare` | Side-by-side metric comparison for two filtered groups of transactions (e.g. one category vs another, one month vs another). | Free |
| `time_series` | Compute a time series by grouping transactions into week or month buckets and applying a metric — useful for trends. | Free |
| `list_transfers` | Match transfers between your own accounts. | Free |
| `adjudicate_transfers` | Decide whether ambiguous pairs from list_transfers are transfers. | Free |
| `evaluate_benchmark` | Score parsed bank statement transactions against the Bankstatemently benchmark ground truth. | Free |
<!-- TOOLS_TABLE_END -->

Call `get_credits` before a large `convert_statement` to confirm sufficient balance.
