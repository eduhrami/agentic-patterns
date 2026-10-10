window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'each agent transfers full control with a tool (<code>transfer</code>) and does not take part again. Each transfer includes the full trace, and a counter in code limits the conversation to 5 transfers.',
  cols: ['Framework', 'How it transfers', 'Context the next agent receives', 'Limits and API'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'The active agent calls <code>transfer_to_agent</code>. In the default mode (<code>chat</code>), the receiving agent keeps control until it transfers to another one.',
      back: 'The conversation session, which the agents share.',
      api: '<code>disallow_transfer_to_parent</code> and <code>disallow_transfer_to_peers</code> restrict who can be transferred to. <code>RunConfig(max_llm_calls=...)</code> caps the model calls per run (500 by default).'
    },
    {
      fw: 'LangGraph (swarm) / LangChain (handoffs)',
      how: 'Tools created with <code>create_handoff_tool</code> that return a <code>Command(goto=...)</code>. The system remembers which agent was last active and the next interaction resumes with it (requires a checkpointer).',
      back: 'By default, the full message history plus a tool message confirming the handoff.',
      api: '<code>langgraph-swarm</code>. <code>recursion_limit</code> caps the graph\'s super-steps (1000 by default since version 1.0.6) and raises <code>GraphRecursionError</code>.'
    },
    {
      fw: 'OpenAI Agents SDK',
      how: 'Handoffs are presented to the LLM as tools named <code>transfer_to_&lt;agent&gt;</code>. The new agent takes over the conversation.',
      back: 'The entire previous history. With <code>input_filter</code> you can trim what is forwarded.',
      api: '<code>handoffs=[...]</code>, <code>input_filter</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Mesh topology, without an orchestrator. The handoff is done with a tool the framework injects based on the handoff rules. If the agent replies without handing off, control goes back to the user.',
      back: 'The user and agent messages; tool calls, including handoff calls, are filtered out before forwarding.',
      api: '<code>HandoffBuilder</code> with <code>add_handoff</code>. Autonomous mode has a per-agent turn limit. Sensitive tools can require human approval.'
    }
  ],
  equiv: 'if the agent that transfers gets control back when the other one finishes, the behavior matches <a href="03_coordinator_dispatcher.html">pattern 3, Coordinator/dispatcher</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>, <i>LLM agents</i> and <i>Runtime config</i>. ADK Docs. <a href="https://github.com/google/adk-docs/tree/main/docs" target="_blank" rel="noopener">github.com/google/adk-docs</a>',
    'LangChain. <i>langgraph-swarm</i>. <a href="https://github.com/langchain-ai/langgraph-swarm-py" target="_blank" rel="noopener">github.com/langchain-ai/langgraph-swarm-py</a>',
    'LangChain. <i>Handoffs</i> and <i>Graph API</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent/handoffs</a>',
    'OpenAI. <i>Handoffs</i>. Agents SDK. <a href="https://openai.github.io/openai-agents-python/handoffs/" target="_blank" rel="noopener">openai.github.io/openai-agents-python/handoffs</a>',
    'Microsoft. <i>Handoff orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/handoff</a>'
  ],
  toolNotes: (() => {
    const n = { transfer: 'ADK: <code>transfer_to_agent</code>. LangGraph: <code>create_handoff_tool</code> (swarm). OpenAI Agents SDK: <code>transfer_to_&lt;agent&gt;</code>. Agent Framework: a handoff tool added by <code>HandoffBuilder</code>.' };
    return { tri: n, red: n, fin: n };
  })()
};
