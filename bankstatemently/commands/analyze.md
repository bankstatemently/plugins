---
name: analyze
description: Categorize and analyze converted Bankstatemently statements.
disable-model-invocation: true
---

# Analyze

Input: $ARGUMENTS

Treat the input as the user's analysis scope: account, product, content hash, date range, or free-text filter.

Follow this sequence:

1. If the scoped statement has not been categorized, call `categorize_statement`.
2. Call `group_by` for category totals within the scope.
3. Call `group_by` for merchant or counterparty totals within the scope.
4. Call `top_n` to rank the largest merchants or counterparties within the scope.
5. Call `time_series` with monthly buckets for trend figures within the scope.
6. Present category totals, merchant or counterparty totals, top merchants, and the monthly trend. Cite content_hash for every figure or table row you report.
