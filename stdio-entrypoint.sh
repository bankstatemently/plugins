#!/bin/sh
# Launch the mcp-remote stdio bridge against the hosted server. Add the API-key
# header only when a key is present: an empty X-API-Key header is a credential
# and takes the real auth chain, while no header keeps directory probes on the
# auth-optional initialize/tools-list path.
set -eu

if [ -n "${BANKSTATEMENTLY_API_KEY:-}" ]; then
  exec mcp-remote https://api.bankstatemently.com/mcp --transport http-only --header "X-API-Key: ${BANKSTATEMENTLY_API_KEY}" "$@"
fi

exec mcp-remote https://api.bankstatemently.com/mcp --transport http-only "$@"
