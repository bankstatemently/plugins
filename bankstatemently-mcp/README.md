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

After installing, enable the plugin. When prompted for `api_key`, leave it blank to sign in with your browser (OAuth) on first use — or paste a `bsk_live_...` key if you're setting up a headless install.

> **Dev install (local checkout):** `cd` to the repo root and run `/plugin marketplace add .`, then `/plugin install bankstatemently-mcp`.

**Try it free:** ask your agent to convert `https://bankstatemently.com/benchmark/statements/bsb-004-statement.pdf` — our published benchmark statement. Benchmark conversions never consume credits.

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
| `convert_statement` | Convert a bank statement PDF into structured data or a spreadsheet. When the user attaches a PDF in the conversation, it arrives automatically as pdf_file — never encode it yourself. Otherwise, pass pdf_url for a public HTTPS link. If your host has no way to reference the attached file at all (no pdf_file/pdf_url equivalent), call request_upload first and pass its upload_id here instead. The base64 pdf parameter is a last resort only, for a caller with no other way to reference the file. Returns accounts, transactions, and metadata. output_format "json" (default) returns the data inline, renderable in chat. The other formats (csv, xlsx, qbo, xero) return a time-limited download link instead: present it as a normal link. Every response includes a "summary" field: use it as the single source of truth for what happened. If the conversation is not in English, translate it faithfully into the conversation language; never add details it doesn't contain. Never echo raw status values (e.g. "completed") or field names. Consumes credits (1 per page). Page limit depends on your plan. | 1 per page |
| `request_upload` | Mint a single-use upload URL for pushing a conversation-attached PDF to Bankstatemently before converting it. Use this ONLY when you have no other way to reference the attached file (no pdf_file/pdf_url equivalent for this host) — e.g. a code-execution sandbox that can see the file on disk but has no URL for it. Playbook: (1) check your sandbox's uploads/attachments directory first — if the file isn't there yet, the mount can lag behind the conversation; ask the user to re-attach or wait a moment and check again before calling this tool. (2) Call request_upload to get upload_url and upload_id. (3) PUT the raw PDF bytes to upload_url with header Content-Type: application/pdf, e.g.: `curl -X PUT "<upload_url>" -H "Content-Type: application/pdf" --data-binary @<path-to-file>`. (4) Once the PUT succeeds, call convert_statement with upload_id set to the same value — never pdf/pdf_url/pdf_file for this flow. The URL and token are single-use and expire quickly; call request_upload again for a fresh one if the PUT fails partway through — never retry a failed PUT against the same URL. If the PUT fails with a network error or a "host not allowed"-style denial, the sandbox is likely blocking outbound requests to api.bankstatemently.com — tell the user to add api.bankstatemently.com to their host's code-execution allowed-domains setting (on claude.ai: Settings → Capabilities → Code execution) and retry. Free to use — no credits consumed (conversion itself still costs credits, same as any other convert_statement call). | Free |
| `get_statement` | Fetch the full converted data for a previously processed document. Use this after convert_statement returns a "processing" status, or to re-fetch results. output_format "json" (default) returns the data inline, renderable in chat. The other formats (csv, xlsx, qbo, xero) return a time-limited download link instead: present it as a normal link. data_mode selects which projection of the data you get: omit it for each output_format's existing default behavior. "normalized" is the cleaned, interpreted view; "original" includes each transaction's raw column values exactly as printed on the source PDF (originalData); "enhanced" is a reformatted view of the original columns (csv/xlsx only for now). Fetch data_mode: "original" when you plan to submit results to evaluate_benchmark — pass its originalData through verbatim; an absent originalData scores that benchmark's raw-fidelity dimension 0 for this document. Every response includes a "summary" field: use it as the single source of truth for what happened. If the conversation is not in English, translate it faithfully into the conversation language; never add details it doesn't contain. Never echo raw status values (e.g. "completed") or field names. | Free |
| `categorize_statement` | Run AI transaction categorization on a previously processed document, then return its category mappings. Returns cached categories with no charge if this document was already categorized. Consumes credits (pooled per page, same rate as the categorize toggle on the website) the first time — free on every re-fetch after. Every response includes a "summary" field: use it as the single source of truth for what happened. | Pooled per page (first run only) |
| `list_statements` | Browse your previously converted bank statements with pagination and optional status filter. | Free |
| `get_credits` | Check your current credit balance. 1 credit = 1 page of bank statement processing. | Free |
| `rate_statement` | Report how well a previously converted bank statement was parsed: submit a 1-5 rating, optionally with structured feedback (only accepted when the rating is 3 or below) and use-case tags. Calling this again for the same document updates your existing rating and clears any previous feedback tied to it. Returns the stored rating state in the response — there is no separate tool to read your own rating back. Every response includes a "summary" field: use it as the single source of truth for what happened. | Free |
| `list_transactions` | Return a filtered list of transactions across your converted statements, capped at 50 rows. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. Every response names the scope it actually evaluated (document count + covered date range) and each returned row carries its source document's content_hash so you can cite it. | Free |
| `aggregate` | Compute a single metric (sum/average/count/max/min) over a filtered set of transactions across your converted statements. Results are per-currency — never sum across currencies yourself. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. | Free |
| `group_by` | Group transactions by a dimension (month/category/merchant/account/currency) and apply a metric to each group. Results are per-currency. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. | Free |
| `top_n` | Return the top N groups ranked by metric (descending), per-currency for monetary metrics. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. | Free |
| `compare` | Side-by-side metric comparison for two filtered groups of transactions (e.g. one category vs another, one month vs another). Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. | Free |
| `time_series` | Compute a time series by grouping transactions into week or month buckets and applying a metric — useful for trends. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. | Free |
| `list_transfers` | THE way to answer any "was money moved between my accounts" / "did I transfer X" question — matches cross-account debit/credit pairs and account-level successions within the current scope. Never try to answer a money-moved-between-accounts question with list_transactions + arithmetic — always call this tool instead. Scope defaults to all your completed statements; pass "scope" to narrow to specific accounts/products and/or a date range. Every response reports the match window (in days) it used, even when no transfers are found — a lack of matches is never silent about how hard it looked. | Free |
| `evaluate_benchmark` | Score parsed bank statement transactions against the Bankstatemently benchmark ground truth. Accepts a statement_id (e.g. "bsb-001") or content_hash, plus your parsed transactions. Returns extraction accuracy, integrity score, and an overall score. Only statements marked published: true in the catalog can be evaluated — held-out statements return an error. transactions[].originalData is optional but strongly recommended: fetch it via get_statement with data_mode: "original" and pass it through verbatim — an absent originalData scores that transaction's raw-fidelity (parsed) dimension 0; never fabricate a value. Free to use — no credits consumed. Read the benchmark://catalog resource first to see available statements and their published status. | Free |
<!-- TOOLS_TABLE_END -->

Call `get_credits` before a large `convert_statement` to confirm sufficient balance.
