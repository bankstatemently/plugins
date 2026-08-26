---
name: convert
description: Convert a bank statement PDF path or URL and offer export links.
disable-model-invocation: true
---

# Convert

Input: $ARGUMENTS

Follow this sequence:

1. If the input is a public HTTPS URL or host-provided PDF attachment, call `convert_statement`.
2. If the input is a local file path and the host cannot pass the file directly, call `request_upload`, upload the PDF bytes to the returned URL, then call `convert_statement` with the upload id.
3. If conversion is still processing, poll `get_statement` until the statement is ready or the tool returns a terminal summary.
4. Present the tool summary, key account details, statement period, balances, and transaction count. Use the response summary as the source of truth when present.
5. Ask which export the user wants. For CSV, XLSX, QBO, or Xero, call `get_statement` with the requested output format and present the returned link.
