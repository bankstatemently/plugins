---
name: bankstatemently
description: Workflow guidance for the Bankstatemently MCP tools — converting bank statement PDFs, listing statements, checking credits, categorizing transactions, rating conversions, and running benchmark evaluations. Use when working with the bankstatemently MCP server.
---

# Bankstatemently MCP

Convert and query bank statements using the Bankstatemently API.

Tool names and descriptions are available live from the MCP server on connect, so
no catalog is needed here.

## Credits

<!-- TOOL_CREDITS_START -->
| Tool | Credits |
|---|---|
| `convert_statement` | 1 per page |
| `request_upload` | Free |
| `get_statement` | Free |
| `categorize_statement` | Pooled per page (first run only) |
| `list_statements` | Free |
| `get_credits` | Free |
| `rate_statement` | Free |
| `list_transactions` | Free |
| `aggregate` | Free |
| `group_by` | Free |
| `top_n` | Free |
| `compare` | Free |
| `time_series` | Free |
| `list_transfers` | Free |
| `evaluate_benchmark` | Free |
<!-- TOOL_CREDITS_END -->

## Recommended workflow

1. Call `get_credits` before a large `convert_statement` to confirm you have enough balance.
2. Call `convert_statement` with either `pdf` (base64-encoded) or `pdf_url` (public HTTPS URL).
3. If the response has `status: "processing"`, call `get_statement` with the returned `document_id` after a few seconds.
4. Use `list_statements` to browse or re-fetch previously converted documents.
5. Use `categorize_statement` when the user wants transaction categories for a converted document.
6. Use `rate_statement` after a conversion when the user wants to submit quality feedback.
7. Use `evaluate_benchmark` only when the user is comparing parsed transactions against a published Bankstatemently benchmark statement.

## Auth

The server reads your API key from the `X-API-Key` header (`bsk_live_...`). Passing it via `Authorization: Bearer` will be rejected.
