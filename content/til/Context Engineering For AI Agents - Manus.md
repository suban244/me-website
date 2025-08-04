+++
date = '2025-08-04T09:01:05+05:45'
draft = false
title = 'Context Engineering Part 1'
+++
> Lessons from [Context Engineering For AI Agents](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
### Design around the KV Cache
Prompt Cache hits means more less cost and faster response. To maximize this, we make the initial context we provide the LLM fixed and make the context *append only*. Also using `cache breakpoints` for better control over the cache.
### Mask, Don't Remove
Related to KV Cache, as context of tools is typically stored put at the start. Making the tools the same across calls is essential in ensure more cache hits.
When previous actions and observations still refer to tools that are no longer defined in the current context, the model gets confused and may lead to schema violations and hallucinations. They recommend using response pre-fill to control the action space of the agent. This can be achieved using things like `tool_choice=<specified>` when interfacing with models.
### File Systems as Context
Observations can be huge, and keeping everything in the context will pollute the context. We can do some context truncation/compression strategies for this case, but this will lead to information loss. This is because it is hard to predict ahead of time, what information we might need.
In such cases, we can use `file system` as context, simplified to a *Key Value* store and the read and write things from this. Then we can make the compression strategies *restore-able*.
Basically even if we remove a file from context, we keep the file name in context in order to access it later.
### Manipulating Attention Via Recitation
Over the course of multiple tool calls, a model might drift from the origin goal. **Manus** uses a `todo.md` file to keep track of the end goal and introduces it at multiple parts of the context to keep the model in track.
### Leaving The wrong stuff in
Keeping errors that occur due to tool calls in context helps the model *learn from its mistakes* and perform better future actions.
### Getting Few Shotted
The power of LLMs come from the having customizable behavior with in-context learning. Techniques such as `few shot learning` can help model perform much better in particular tasks.
This can also very easily backfire if you aren't extremely careful about the model's context during inference. The model may start to imitate the pattern of behavior in the context even if that is not in your best interest.
Example from **Manus**, when given a list of 20 resumes to review, after a while the model starts falling into a pattern and can start to **over generalize**
Example from experience
- We used to pass only the user message and bot messages in the context of a long running chatbot. (No previous tool call information). As such in long form conversation, the model would sometimes not use a tool for retrieving information, when it had previously (in the same conversation) used to tool for retrieval. This was argubly because the model learned to not use tool calls because of the few shot examples in the chat history, leading to **hallucinations**
- Another chat bot was tasked with following a strict set of workflows followed by a more relaxed set of tasks. The workflow at the start would make it the model do the relaxed set of tasks with the same strictness as the first which lead to very unpleasant chat experiences and **brittleness**
