# bankstatemently/plugins

[![plugins MCP server](https://glama.ai/mcp/servers/bankstatemently/plugins/badges/card.svg)](https://glama.ai/mcp/servers/bankstatemently/plugins)

Marketplace plugins for [Bankstatemently](https://bankstatemently.com) — convert bank statements.

## Install via Claude Code marketplace

```bash
/plugin marketplace add bankstatemently/plugins
/plugin install bankstatemently@bankstatemently
```

After installing, enable the plugin and paste your `bsk_live_...` key when prompted for `api_key`.

Get an API key at [bankstatemently.com/developer](https://bankstatemently.com/developer).

## Plugins

- **[bankstatemently](./bankstatemently/)** — MCP server for converting bank statements.
  Convert PDFs, list statements, check credits, run benchmark evaluations.
