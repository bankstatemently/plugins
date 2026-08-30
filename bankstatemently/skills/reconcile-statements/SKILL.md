---
name: reconcile-statements
description: Use when the user asks to check statement coverage, missing periods, balance continuity, or cross-account transfers. Do not use for converting a new PDF, spending categorization, or benchmark scoring.
---

# Reconcile

**Input:** the account, product, date range, or free-text scope to reconcile.
**Output:** a concise reconciliation report with covered periods, missing periods, balance-continuity breaks (with source content_hash pairs), and transfer findings.

Treat the input as the account, product, date range, or free-text scope to reconcile.

Follow this sequence:

1. Call `list_statements` to find statements in scope.
2. For each completed statement in scope, call `get_statement`.
3. Sort statements by account and period. Report missing periods, overlapping periods, and gaps.
4. Compare each closing balance with the next opening balance for the same account. Report every balance-continuity break with the two source content_hash values.
5. Call `list_transfers` for the same scope to identify cross-account matches and large unmatched movements when relevant.
6. Present a concise reconciliation report with the account scope, covered periods, missing periods, balance-continuity breaks, and transfer findings.

**Example prompt:** Reconcile my savings account for 2024 — flag missing months and any balance breaks.
