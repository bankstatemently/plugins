---
name: benchmark
description: Convert and score a published Bankstatemently benchmark statement.
disable-model-invocation: true
---

# Benchmark

Input: $ARGUMENTS

Treat the input as a benchmark statement id, PDF URL, or free-text benchmark request.

Follow this sequence:

1. Read the benchmark catalog resource and choose the named published statement.
2. Convert the benchmark PDF with `convert_statement`.
3. Fetch the converted data with `get_statement` using original data mode.
4. Pass the benchmark statement id and original parsed transactions to `evaluate_benchmark`.
5. Present extraction accuracy, integrity score, overall score, and any major failure categories. Cite the benchmark statement id and converted document content_hash.
