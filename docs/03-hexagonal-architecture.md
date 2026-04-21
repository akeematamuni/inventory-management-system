# ADR-03: Hexagonal Architecture with Ports and Adapters

**Date:** January 2026  
**Status:** Accepted  
**Author:** Akeem Amuni

---

## Context

The inventory system needed to support multiple infrastructure concerns simultaneously, two databases (PostgreSQL and MongoDB), two event transports (NestJS EventEmitter and Kafka), structured logging with swappable destinations, and a REST API presentation layer. Without a deliberate structural decision, these concerns would naturally bleed into each other. 
Business logic would develop implicit dependencies on TypeORM, NestJS decorators would appear inside domain entities, and swapping any infrastructure component would require touching code that should have nothing to do with infrastructure.

The deeper problem is longevity. Infrastructure usually changes as databases get replaced, frameworks get upgraded, and event transports get swapped as scale requirements change. Business rules such as what constitutes a valid stock movement, how FIFO valuation is calculated, what triggers a low stock alert, change far less frequently than the 
infrastructure supporting them. Tying business rules to infrastructure decisions means every infrastructure change carries the risk of introducing business logic bugs.

---

## Decision

Applying hexagonal architecture, also known as ports and adapters, as the structural pattern for the entire system.

The system is divided into three major layers and one edge lyer:

**Domain**: The inner zone. Contains entities, value objects, aggregates, domain exceptions, and repository interface(ports). Has zero imports from NestJS, TypeORM, Mongoose, or any external library. It is pure TypeScript.

**Infrastructure**: This layer contains TypeORM entities, Mongoose schemas, repository implementations, event publisher adapters. Implements all the interfaces or contracts defined by the domain.

**Application**: Contains command handlers, query handlers, and DTOs. Orchestrates domain objects and calls repository ports. Does not know which database or which event transport is active.

**Presentation**: Sits at the boundary layer. Controllers receive HTTP requests, dispatch commands and queries via the CQRS buses, and return responses.

Dependency direction is strictly inward:
Presentation (controllers) → Application (cqrs handlers) → Infrastructure (databases, adapters) → Domain (aggregates, events)

Domain never imports from infrastructure, application, or presentation.

Ports (the interfaces domain defines), are the contracts that infrastructure must satisfy. `IProductRepository`, `IStockLedgerEntryRepository`, `IInventoryEventPublisher` are all ports.  

TypeORM implementations, Mongoose implementations, InventoryPublisherEmitter, and InventoryPublisherKafka are all adapters that satisfy those contracts.

---

## Consequences

**Positive**

- The domain layer is independently testable without a database, without NestJS, and without any infrastructure running. Unit tests for business logic run with no test containers or mocking of framework internals.

- Infrastructure components are replaceable without touching business logic. Switching from MongoDB to a different document store just requires writing a new adapter that satisfies `IProductRepository`.

- The event transport switch between EventEmitter and Kafka requires no application code changes because both adapters implement the same `IInventoryEventPublisher` port.

- New infrastructure concerns like a new database, a new messaging system, a new logging destination, are just additions, not modifications because existing code does not change.

**Negative**

- More files and indirection. A simple CRUD operation would touche a controller, a command, a handler, a repository port, a repository implementation, a mapper, and an ORM entity. For genuinely simple domains or workflows, this might be over-engineering without proportional benefit.

- Mappers between domain entities and ORM entities are mechanical and verbose. Every aggregate requires a mapper that must be kept in sync with both the domain entity and the ORM entity as either evolves.

- The strict dependency inversion requires discipline. It is easy for a developer under time pressure to import an infrastructure concern directly into the application layer.

---

## Alternatives Considered

**Simple layered architecture (controller → service → repository)**: Rejected because it is a slippery slope towards tight coupling. Services in this pattern might develop direct TypeORM or Mongoose dependencies, making the business logic hard to test without a database.

**Vertical slice architecture**: Considered as a complement but not as a replacement. Since vertical slices organise code by feature rather than by layer, multiple layers would spring due to features. Current approach uses CQRS which achieves similar feature-level cohesion within the hexagonal structure without abandoning the strict dependency inversion that protects the domain.

