# ADR-05: CQRS with @nestjs/cqrs

**Date:** January 2026  
**Status:** Accepted  
**Author:** Chinyere Nwalie

---

## Context

The absence of CQRS results to read and write operations living in same service layer. This inventory system handling concurrent warehouse activities across two geographical locations, creates a real problem; 

- A read and write hitting the same service at same time.
- Conflicted operations and system freeze, or returning a stale data mid-transaction.

With 4,000+ SKUs moving across two warehouses consecutively, where stock queries, check balances, filtering by warehouse, and looking up constant movement history. Having reads and writes share same service is an active bottleneck.

---

## Decision

Implement CQRS with `@nestjs/cqrs` divides the object methods into seperate catergories.

1. Commands handles all state mutation; modifications, updates of events - stock receipts, trnasfers, adjusments, and write to PostgreSQL.

2. Queries handle all reads and never touch write paths.

Each side has its own handlers, own bus, and zero knowledge of each other. To illustrate, `ReceiveTransferHandler` implemets `ICommandHandler<ReceiveTransferCommand>` and owns the write path for the warehouse-to-warehouse transfers. 

`GetAllStockTransferQuery` owns the read path for fetching transfer records by status or warehouse, there's no conflict of events and no shared service.


---

## Consequences

**Positive**

- Read and write paths are fully isolated; concurrent operations no longer conflicts

- Each handler has a single responsibility, which makes them independently testable

- `CommandBus` and `QueryBus` make the intent of every controller call explicit; you always know if a function is in mutating state or reading it

- `@nestjs/cqrs` makes boundaries explicit and enforced; commands and queries are seperated at the application layer, but without enforcing that boundary structurally, nothing stops a command handler from reading state or a query from mutating it.


**Negative**

- Adds boilerplate per feature; every operation needs a command or query class, a handler, and regisration on the bus

- Mismatch for smaller or simpler systems; the complexity is only justified as you scale

- Learning curve for engineers unfamiliar with this pattern.

---

## Alternatives Considered

**Traditional service layer**: Rejected. Both read and wirte operations in one service, while simpler to set up, compete for same resource when traffic increases, whihc is the exact failure this system was experiencing.

**Repositories called by controller**: Rejected because bypassing the application layer entirely makes business logic untestable, and has no place in a hexagonal architecture.

**Methods separation**: Splitting reads and writes into separate methods on same service is a half-measure. It doesn't enforce the boundary, a developer and easily call a write method from a read path and nothing to check-make them. While considered ata first, for isolation reasons, it was rejected.