# ADR-001: Immutable Append-Only Stock Ledger

**Date:** January 2026  
**Status:** Accepted  
**Author:** Akeem Amuni

---

## Context

Every inventory system needs to answer two questions at any point in time:

1. How much stock do we have right now?
2. How did we get here?

The naive approach is to maintain a single quantity field per product per warehouse and update it whenever stock moves. This is simple to implement but has serious problems in a production system:

- There is no history, you cannot answer "what was the helmet balance on 5 December?"
- There is no audit trail, you cannot prove who changed a quantity or why
- Concurrent updates race against each other, two simultaneous movements can corrupt the balance
- Mistakes are destructive, a wrong update overwrites the correct value permanently

---

## Decision

Implement an **immutable append-only stock ledger**.

Every stock movement; receipts, transfers, adjustments, cycle count corrections, opening stock, creates a new row in `stock_ledger_entries`. This row is never updated and never deleted. Corrections are made by creating new entries in the opposite direction, not by modifying existing ones.

Each entry also stores `balance_after`, a snapshot of the balance at the time of writing. This means the balance at any historical date can be read directly from the ledger without recalculation.

A separate `stock_balances` table maintains the materialised current total per product per warehouse. This exists purely for fast reads, querying the current balance does not require summing the entire ledger. The balance is updated atomically alongside every ledger write inside a single database transaction.

The domain entity `StockLedgerEntryEntity` enforces immutability at the code level, it has no `update()` method and no setters. The repository port has no `update()` or `delete()` method. The database table has no UPDATE or DELETE permissions granted to the application role.

---

## Consequences

**Positive**

- Complete audit trail: Every movement is permanently recorded with who, when, why, and what the balance was after
- Historical queries: Stock level at any past date is a single indexed read
- Race condition safety: Concurrent writes append new rows rather than updating the same row
- Debuggability: Stock discrepancies can always be traced to their source movement
- Financial accuracy: FIFO and AVCO valuation are calculated directly from receipt entries on the ledger

**Negative**

- Storage grows indefinitely: The ledger is never pruned. At enterprise scale, archival strategies would be needed
- Corrections require new entries: A clerk cannot simply "fix" a wrong quantity. They must create a correcting adjustment. This is a feature, not a bug, but requires training
- Query complexity: Reporting queries join the ledger with balances and product settings rather than reading a single table

---

## Alternatives Considered

**Mutable stock table**: Rejected because it provides no audit trail and is vulnerable to concurrent update races.

**Event sourcing**: Considered but rejected as over-engineering for this scope. Event sourcing rebuilds state by replaying all events. Our approach stores `balance_after` on each ledger entry, which achieves the same historical query capability with simpler infrastructure.
