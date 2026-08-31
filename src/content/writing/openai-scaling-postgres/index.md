---
title: 'OpenAI - Scaling Postgres'
date: 2026-01-28T21:31:52+05:45
kind: til
tags: [databases, scaling, postgres]
aliases: [/til/openai-scaling-postgres/]
---

*From: https://openai.com/index/scaling-postgresql/*

Properly Scaling /PostgreSQL is important as it can be easy to overload if we are not careful
Currently it supports millions of queries per second.
# Architecture
- A single primary for writes and a lot of secondary replicas for reading data (Azure PostgreSQL)
	- For read-heavy load, scaling is good, but write heavy load can be an issue
		- PostgreSQL's Multi Version Concurrency Control (MVCC)
	- Code optimized to minimize writes
- Shardable data moved to another service - Azure Cosmos DB (noSQL database)
	- Postgres remains unsharded.

## Challenges Faced and Optimizations
### Reduce Load on Primary
- Offload **read** traffic to replicas whenever possible
	- Only read queries part of a write transaction are run on primary.
- **Writes**
	- If Shardable
		- To Azure CosmosDB
	- if not
		- Optimize the queries
		- Remove redundant writes
		- introduce *lazy writes*
		- when backfilling (say: adding new columns) put rate limits

### Query optimization
The good old
- reduce number of joins
- no Online Transaction Processing (OLTP) anti-patterns
- Break down heavy db queries into smaller ones with joins in the application layer.
	- ORMs can make these queries hard to find.
- `idle_in_transaction_session_timeout` to allow autovaccuum

### Single Point of Failure Mitigation
- The write primary is a single point of failure
- Run it in *High Availability* mode - with a hot standby

### Workload isolation
- Requests split into categories
- sent to different instances, 
- Same with features and products as well

### Connection Pooling
- `PgBouncer` as proxy to pool database connections
	- efficient reuse of connections
### Caching Layer
- Cache layer serves most read traffic
- To prevent high db queries during high cache miss phases
	- `Cache locking (and leasing)` mechanism
	- When many request miss cache only one of them acquires the lock to fetch data from db
	- All other requests wait for data in cache
	- protects against load spikes

### Properly scaling read replicas 
The primary streams Write Ahead Logs (WAL) to all of the read replicas once.
- This does introduce latency as primary has to stream all write operations to all replicas)
- They acknowledge that their approach will probably not scale for 100+ replicas, but for 50, it is scaling fine
- OpenAI plans to introduce [Cascading Replication](https://www.postgresql.org/docs/current/warm-standby.html#CASCADING-REPLICATION) for better scalability in the future.

### Rate Limits
Rate limits on
- Connection Pooler (Probably like PgBouncer or the SQLAlchemy's inherit pooler)
- Proxy (Probably on endpoint level, request / sec / client )
- Queries
	- ORM layer modified to rate limit requests / block queries based on their digest.
	- Protects against a serge of certain query execution

And keeping retry intervals sufficiently large

### Schema Management 
Queries that say change the datatype of the column can trigger a [full table rewrite](https://www.crunchydata.com/blog/when-does-alter-table-require-a-rewrite). As such they are very careful with schema changes. 
- Full Table Rewrite: Copy all the data to a new table and delete existing
- To test if an `alter` will do a `full table rewrite`, an approach is to make a copy of the table and perform the alter in the copied table - the Try It and See (TIAS) approach
- Before running the alter see the file location of the table
	- Postgres stores each table in a file
- If the file location changes, then we know it triggered a `full table rewrite`

A 5 second timeout rule on schema changes  

Only permit   
- adding / removing *certain* columns
- creating and dropping indices concurrently
No new tables are permitted.
Backfilling a table field done with a rate limit to prevent write spikes
