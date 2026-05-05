# ADR-06: Kafka as Optional event bus

**Date:** January 2026  
**Status:** Accepted  
**Author:** Chinyere Nwalie

---

## Context

NestJS EventEmitter is synchronous by default events are triggered and handled immediately in same process. Though when app crashes, the event has already been processed but but the primary limitation is these events only exist in memory they aren't persisted anywhere; 

- There's no replay of past events, 
- Recover state after a failure or 
- Deliver events to other services/processes later

For an inventory management system, missing a stock update or alert has direct business cost, this is not reliable enough for production use

---

## Decision

Kafka is accepted as an optional event transport. It was implemented specifically how it handles failures and scale. On the server side, it runs as a cluster (brokers), if one fails, another takes over with no data loss and no service interruption. Events are stored as key-value records (e.g. key: `company-A`, value: `purchase-order-received`, timestamp: `Jan 2026 12:00am`) and are persisted to disk, not deleted after use. A consumer can read same event multiple times, and retention is confogurable per topic.

Topics are also partitioned across servers, where reads and writes can happen in parallel across multiple brokers simulaneously, which is what gives kafka it's scalability for this system.

Kafka is optional than default because it carries real infrastructure cost. In development, NestJS EventEmitter is sufficient and free. It is switched to for production where persistence and fault tolerance matters

---

## Consequences


**Positive**

- Events are persistent - a server crash does not cause event loss

- Producers and consumere are fully decoupled neither knows the other exists, and if consumer is slow, it never blocks the producer.

- An event can be replayed from any point, even when data becomes corrupted, the system can recover by replaying the saved events from last event's offset number

**Negative**

- Kafka is expensive to run and more complex to manage because it requires multiple services and extra setup to handle messaging reliably.

- It makes local development complicated, which is why EventEmitter remains the default for development.

- Kafka guarantees events are delivered atleast once; same event can arrive more than once, and the event handler must account for that.

---

## Alternatives Considered

**RabbitMQ**: Rejected. Yes it is a solid message broker and easier to operate than kafka, but it follows a traditional queue model where messages are deleted after consumptiomn which isnt what we want. Being able to re-read past events to recover state was a hard requirement. 

**Redis Pub/Sub**: Fast and lightweight, rejected because it is entirely in memory with no persistence. If no consumer is listening at the exact moment an event is published, it is lost. It was completely ruled out for production use and failure mode is worse than NestJS EventEmitter.

**abc**