FROM node:22-alpine

# Pin mcp-remote here because Glama builds this image as a reproducible stdio
# release. User-facing CLI docs keep @latest so interactive clients get fixes.
RUN npm install -g mcp-remote@0.8.3

COPY stdio-entrypoint.sh /usr/local/bin/stdio-entrypoint
RUN chmod +x /usr/local/bin/stdio-entrypoint

ENTRYPOINT ["stdio-entrypoint"]
