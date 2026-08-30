---
name: setup
description: Guide Claude through the first Bankstatemently MCP connection.
---

# Bankstatemently Setup

Use this when a user is installing or activating the Bankstatemently plugin.

## Interactive setup

1. Ask the user to leave the API key field blank during plugin install.
2. On the first tool call, the MCP server will challenge the client and open the browser sign-in flow.
3. After sign-in completes, call `get_credits` to confirm the connection and report the returned credit summary.

## Headless setup

For CI, scripts, or any host without a browser, ask the user to create a live API key in the Bankstatemently developer portal at https://bankstatemently.com/developer. The key starts with bsk_live_.

Use the key only through the plugin's sensitive API key field or the MCP server's X-API-Key header.

The server reads your API key from the `X-API-Key` header (`bsk_live_...`). Passing it via `Authorization: Bearer` will be rejected.

## Credits

Tool credit costs for the Bankstatemently MCP tools:

<!-- TOOL_CREDITS_START -->
| Tool | Credits |
|---|---|
| `convert_statement` | 1 per page |
| `request_upload` | Free |
| `get_statement` | Free |
| `categorize_statement` | Pooled per page (first run only) |
| `list_statements` | Free |
| `dismiss_statement` | Free |
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
