---
title: 'SWE vs AI Workflow'
date: 2025-05-16T14:19:22+05:45
kind: til
tags: [ai, engineering]
aliases: [/til/swe-vs-ai-workflow/]
---

### The nature of the work
Most of the early Software Engineering (SWE) work involves a more deterministic work. There are standards and things work mostly as expected.  
This differs from AI Engineering Workflow as, while there are best practices a big portion of the work is somewhat uncertain.  
This generally results in unknown timelines and progress that cannot be measured in the usual sense.

While `Make a integration with X` can be somewhat measured with it happening piece by piece. (linear trajectory)  
Something like `Improve the search functionality` 
 - There is also no clear indication of what change will do the trick
 - It might happen, at some time, after scrapping a couple of ideas. (non linear trajectory)

### Indicators
There are two ways of measuring progress
1. **Leading Indicators:**
  - how much work has been put in
  - Number of experiments done
  - Knowledge Gained
2. **Lagging Indicators:**
  - Completeness
  - Accuracy

While the lagging indicators work fine for something like software engineering, they can be demotivating when it comes to AI Engineering.
The goal is then, as a AI Engineer to build around leading indicators. 
- **Experiments Done**
  - Things tried this week
- **Knowledge Gained**
  - Documentation of Failed experiments
  - Better understanding of the problem space
- Reproducibility for taking thigns to production

### When building AI Products
Working on a product generally means there are deadlines and things tend to devolve quite rapidly unless held together with concious effort.
- Keep both leading and lagging indicators in mind when building AI Systems.  
- Think in terms of research, time box the research phases, and make decisions at the end of them.
- Modularity of systems, as there will be frequent experiemnts and swapping of pieces.

### A Personal Reflection as a AI Engineer
In my past year working in the industry, even tho I worked as a `AI Engineer` I think a lot of the work are more akin to a Software Engineer who knows a little bit about how AI works.  
I believe what is lacking is the experimental workflow. While I made many experimental changes, they were only of the two categories
- Vibe Checked and pushed to production
- Uncertainity and the changes never seeing the light of day.
Moving forward I plan to establish a more structured experimental framework.
- Building a experimental setup. (yeah you kind of need one for doing experiments).
- A more systematic documentation of all attempts and time boxing the experiments.

Inspired by Jason Liu article [SWE vs AI Engineering Standups](https://jxnl.co/writing/2024/10/25/running-effective-ai-standups/)
*(mostly a rewrite)*
