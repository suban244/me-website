---
title: "Instacart's LLM Driven Search and Discovery"
date: 2025-06-06T00:45:32+05:45
kind: til
tags: [llm]
aliases: [/til/llm-driven-search-and-discovery/]
---

Background: Instacart is a platform for buying groceries and everyday goods.
## LLM in Query Understanding
Challenging Queries
- Overly general queries
- Overly specific queries (tail end queries)
They use multiple models as components for query understanding: 
- spell correction
- query normalization
- category, rewrites, brand, query tagging, aisle classification
#### Product Category Classification
 - Category Generation
	 - (User Query, Categories) tell llm to pick categories that are a exact match, (specific = good)
- Chain of Thought Verification of the categories
- Post Processing guardrails (embedding)
#### Query Rewrite 
- Given a Query
	- Strong Substitute rewrite
	- broader rewrite
	- synonym rewrite

## LLM in Product Discovery
- **Problem**: When user selects a product, we would like to show products that user might add to the cart
- **Basic Generation**: Given a query, give me **substitutes** and **complementary** items.
- **Augmented Generation**:
	- Query
	- Query Annotations (Brand, Category, ...)
	- Items bought after this
- Diversity Based Reranking

## Serving
- Take search logs
- Call llm in a batch mode 
- Store everything, content, metadata, **even products**
- During runtime use some content retrieval technique

*from [AI Engineer World’s Fair 2025 - LLM RECSYS](https://www.youtube.com/watch?v=3k4a0PemMu4)*
*Their blog on [product discovery](https://tech.instacart.com/supercharging-discovery-in-search-with-llms-556c585d4720)*
