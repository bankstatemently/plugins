---
name: bankstatemently
description: Workflow guidance for the Bankstatemently MCP tools — parsing bank statement PDFs, listing statements, checking credits, and running benchmark evaluations. Use when working with the bankstatemently MCP server.
---

# Bankstatemently MCP

Parse and query bank statements using the Bankstatemently API.

The server exposes five tools whose names and descriptions are available live from
the MCP server on connect — no catalog needed here.

## Credits

**1 credit = 1 page** of bank statement processing. Credits are consumed by `parse_statement` only; all other tools are free.

## Recommended workflow

1. Call `get_credits` before a large `parse_statement` to confirm you have enough balance.
2. Call `parse_statement` with either `pdf` (base64-encoded) or `pdf_url` (public HTTPS URL).
3. If the response has `status: "processing"`, call `get_statement` with the returned `document_id` after a few seconds.
4. Use `list_statements` to browse or re-fetch previously processed documents.

## Auth

The server reads your API key from the `X-API-Key` header (`bsk_live_...`). Passing it via `Authorization: Bearer` will be rejected.
