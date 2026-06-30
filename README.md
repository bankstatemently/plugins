# bankstatemently/plugins

Marketplace plugins for [Bankstatemently](https://bankstatemently.com) — parse and query bank statements.

## Install via Claude Code marketplace

```bash
/plugin marketplace add bankstatemently/plugins
/plugin install bankstatemently-mcp@bankstatemently
```

After installing, enable the plugin and paste your `bsk_live_...` key when prompted for `api_key`.

Get an API key at [bankstatemently.com/developer](https://bankstatemently.com/developer).

## Plugins

- **[bankstatemently-mcp](./bankstatemently-mcp/)** — MCP server for parsing and querying bank statements.
  Parse PDFs, list statements, check credits, run benchmark evaluations.
