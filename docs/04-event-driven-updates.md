# ADR-03: Event-driven balance updates and alerts

**Date:** January 2026  
**Status:** Accepted  
**Author:** Chinyere Nwalie

---

## Context

The system tracks and manages inventory stock movements across two warehouses where (purchases, transfers, adjustments, and reporting) occur frequently. The default use of excel-sheets and pen with notepad leads to an inconsistent stock balances, delayed updates, and no reliable audit trail.

When a stock movement is recorded through (receipt, transfer_in or transfer_out);

1. The system would need to recalculate balances
2. Potentially trigger low-stock or stockout alerts.

If alert logic lives inside the same service that processes commands, testing becomes difficult and, any failure in the alert path can block the stock movement itself.

We need balance recalculations and alerts to be traceable, replayable, yet decoupled.

---

## Decision

Adopt an event-driven approach where the domain events ( `stock-received`, `stock-transfer-dispatch`, `stock-transfer-received`) are detached from aggredates and are asynchronously handled to update balances and trigger alerts

- The `StockBalanceUpdateHandler` handles all events with side effects that writes to the immutable ledger and stock balance

- A dedicated listener subsribes to domain events and dipsatcges balance recalculation logic

- In production, @EventPattern subscribes to `StockBalanceUpdateHandlerKafka` where the events are published to a Kafka topic and used by separate services, giving persistence, replay, and cross-service capabiloty

- Alerts (low stock, sold out) are triggered as side effects of these events

---

## Consequences

**Positive**

**Independently testable side effects:**  Alert listener are unit tested. It is fed with a mock event with no need to invoke the full command pipeline

**Replayability:** With Kafka in production, if the balance projection gets corrupted or the alert service was down, you can replay events from a specific offset and recover state

**Audit trail by default:** Every balance update and alert is a reaction to a recorded event as you know exactly what triggered what and when

**Supports extensibility:** New consumers (eg; notificqtions, analytics) can subscribe without modifying existing logic


**Negative**

- Introduces eventual consistency between ledger and balance projections

- Increased system complexity (event design, handling, debugging)

- Harder to trace flow compared to synchronous logic

- Operational overhead when using Kafka (infrastructure, monitoring)

---

## Alternatives Considered

**Direct synchronous balance update:** Updating balances within the same transaction as stock movement will ensure strong consistency, it was rejected because it tighly couples domain logic with projection concerns and increases latency in command handling.

**Periodic batch processing:** A cron job that periodically recalculates balances from the ledger was considered as a vakid mechanism but was rejected as it's a poor primary strategy; it introduces delayes, wastes compute on unchanged records, and doesn't naturally support real time inventory alerts.
