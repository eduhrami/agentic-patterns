window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the orchestrator chooses which analysts to invoke with a tool (<code>invoke_analysts</code>), the analysts run in parallel and a formula in code combines their scores.',
  cols: ['Framework', 'How it chooses who to invoke', 'How it combines the results', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'The <code>Send</code> API sends the request only to the chosen nodes, decided during execution; each one runs with its own input.',
      back: 'The results accumulate in a state key through a reducer; a later node applies the formula in code.',
      api: '<code>Send</code>, reducers'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'In <code>ConcurrentBuilder</code> the participants are fixed when the workflow is built. To choose them at run time you build your own workflow with fan-out edges.',
      back: 'A custom aggregator (<code>with_aggregator</code>) can apply the weighted formula without an LLM.',
      api: '<code>ConcurrentBuilder</code>, <code>with_aggregator</code>, <code>WorkflowBuilder</code>'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> runs a fixed set. To choose at run time, a coordinator invokes only the needed analysts as tools (<code>AgentTool</code>) or you write a custom agent.',
      back: 'The scores stay in the session state or as tool responses; a custom agent applies the formula.',
      api: '<code>AgentTool</code>, <code>BaseAgent</code>, <code>ParallelAgent</code>'
    }
  ],
  equiv: 'if all the analysts were always invoked, the behavior would match <a href="05_fan_out_gather.html">pattern 5</a>. The fundamental analyst, which consults its own sub-agents, is a case of <a href="09_hierarchical.html">pattern 9, Hierarchical decomposition</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Orchestrator-worker). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>',
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ],
  toolNotes: {
    orq: {
      invoke_analysts: 'LangGraph: <code>Send</code> only to the chosen analysts. Agent Framework: <code>ConcurrentBuilder</code> fixes the participants; selecting them needs your own workflow. ADK: one <code>AgentTool</code> call per chosen analyst.'
    }
  }
};
