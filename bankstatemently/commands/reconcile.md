---
name: reconcile
description: Check statement coverage, balance continuity, and cross-account transfers.
disable-model-invocation: true
---

# Reconcile

Input: $ARGUMENTS

Treat the input as the account, product, date range, or free-text scope to reconcile.

Follow this sequence:

1. Call `list_statements` to find statements in scope.
2. For each completed statement in scope, call `get_statement`.
3. Sort statements by account and period. Report missing periods, overlapping periods, and gaps.
4. Compare each closing balance with the next opening balance for the same account. Report every balance-continuity break with the two source content_hash values.
5. Call `list_transfers` for the same scope to identify cross-account matches and large unmatched movements when relevant.
6. Present a concise reconciliation report with the account scope, covered periods, missing periods, balance-continuity breaks, and transfer findings.
