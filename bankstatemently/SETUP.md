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
