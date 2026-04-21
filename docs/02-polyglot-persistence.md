# ADR-02: Polyglot Persistence with PostgreSQL and MongoDB

**Date:** January 2026  
**Status:** Accepted  
**Author:** Akeem Amuni

---

## Context

The inventory system manages two categories of data that have fundamentally different characteristics.  

The first category is transactional operational data, stock ledger entries, balance records, purchase orders, stock transfers, adjustments, cycle counts, and stock alerts. This data participates in financial calculations. It must maintain ACID guarantees and might require complex joins. It has strict referential relationships as a purchase order line cannot exist without a purchase order. It must never be lost or silently corrupted. It is written frequently and read with various filter conditions.

The second category is catalogue data comprising of products and warehouses. This data describes business entities rather than recording business events. It has a flexible and evolving schema, product attributes change as the catalogue grows, new fields are added without requiring migration of existing records. It is read far more often than it is written. It does not participate in financial transactions so a product record being unavailable for a moment does not corrupt a ledger entry. It benefits from document-centric storage where a product and all its attributes are retrieved as a single document rather than assembled from multiple joined tables.

Forcing both categories into a single relational database works but imposes the rigid schema model of relational databases onto catalogue data that does not naturally fit it. Forcing both into a single document database sacrifices the ACID guarantees and join capabilities that transactional data requires.

---

## Decision

Leverage PostgreSQL with TypeORM for all transactional operational data and MongoDB with Mongoose for the product and warehouse catalogue.

MongoDB <> Mongoose

| Table Name | Characteristics |
|---|---|
| products | flexible catalogue, variant-ready schema |
| warehouses | configuration document, rarely changes |

PostgreSQL <> TypeORM

| Table Name | Characteristics |
|---|---|
| stock_ledger_entries | immutable, append-only, ACID critical |
| stock_balances | materialised projection, transactional |
| purchase_orders | stateful aggregate, relational |
| purchase_order_lines | child entity, foreign key enforced |
| stock_transfers | stateful aggregate, relational |
| stock_transfer_lines | child entity, foreign key enforced |
| adjustments | immutable record, audit critical |
| cycle_counts | stateful aggregate with approval workflow |
| cycle_count_lines | child entity, variance calculation |
| stock_alerts | operational record, status lifecycle |
| product_settings | bridge table — see below |

A `product_settings` table in PostgreSQL holds `reorder_point` and `is_active` for each product, mirroring the product's UUID primary key from MongoDB. 
This table exists specifically to enable the low stock detection query:
```sql
SELECT balance.*
FROM stock_balances balance
INNER JOIN product_settings settings
    ON settings.id = balance.product_id
WHERE balance.quantity <= settings.reorder_point
AND settings.is_active = true
```

Without this bridge table, the low stock detection query would require fetching all balances from PostgreSQL, fetching all products from MongoDB, and joining them in application memory, an approach that does not scale and introduces consistency risks between two asynchronous reads. The bridge table keeps the query entirely within PostgreSQL while keeping the product's primary catalogue data in MongoDB.

The trade-off of maintaining `product_settings` in sync with the MongoDB product document is accepted. 
When a product is created, both the MongoDB document and the `product_settings` row are written. When `reorder_point` changes,both are updated. These two writes cannot share a database transaction as they are in different databases. Eventual consistency 
between them is accepted because `reorder_point` is not financially critical. A brief period where the reorder point in `product_settings` does not match the product document does not corrupt any ledger entry or balance record.

The domain layer is completely unaware of which database stores which entity. `IProductRepository` and `IWarehouseRepository` are interfaces defined in the domain. The infrastructure layer provides Mongoose implementations. `IStockLedgerEntryRepository` and all other transactional repository interfaces are implemented with TypeORM. Swapping either database requires a new infrastructure adapter as no domain or application code changes is required.

---

## Consequences

**Positive**

- PostgreSQL ACID guarantees protect all financially consequential data. The ledger, balances, and order state are always consistent even under concurrent writes.

- MongoDB flexible schema accommodates product catalogue evolution without migrations, new product attributes are added as document fields without altering existing records.

- The hexagonal architecture ensures neither database technology leaks into business logic. Domain entities are plain TypeScript objects, they do not know whether they are persisted to PostgreSQL or MongoDB.

- The polyglot persistence decision is a demonstrable architectural trade-off, the right tool for the right access pattern which signals mature engineering judgement.

**Negative**

- Two databases to operate, monitor, back up, and reason about. The operational surface area is larger than a single-database system.

- The `product_settings` bridge table introduces a synchronisation responsibility. If the sync fails and is not detected, low stock detection may behave incorrectly for affected products. This risk is mitigated by writing both records in the same application request and logging any failure explicitly.

- Cross-database operations cannot share a transaction. Product creation writes to MongoDB first, then writes `product_settings` to PostgreSQL. If the second write fails, a compensating action is required. This is a known limitation accepted because the consequence of a product existing in the catalogue but has no settings row is detectable and recoverable, not silently corrupting.

---

## Alternatives Considered

**PostgreSQL only**: This is simpler to operate but was rejected because it forces a rigid schema on product catalogue data. Product variants, extended attributes, and flexible categorisation are natural requirements for a growing catalogue and do not fit well in a relational schema without significant normalisation overhead.

**MongoDB only**: Though flexible schema everywhere, rejected because MongoDB's multi-document transaction support, while available, would add complexity that PostgreSQL handles natively for the transactional use cases. The immutable ledger pattern specifically benefits from PostgreSQL's append-only INSERT semantics, indexing capabilities, and join performance across the balance and ledger tables.

**TypeORM MongoDB driver**: Considered to avoid introducing Mongoose as a second ORM. Rejected because the TypeORM MongoDB driver is poorly maintained, lags behind the native MongoDB Node.js driver, and does not support many MongoDB-specific query and aggregation capabilities. Mongoose is the industry standard for MongoDB in Node.js and has first-class NestJS support via `@nestjs/mongoose`.
