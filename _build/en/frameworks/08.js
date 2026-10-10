window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the orchestrator queries the data, creates one worker per region with a tool (<code>create_worker</code>) and each worker returns a structured result. The number of workers is decided during execution, not in the design.',
  cols: ['Framework', 'How it creates the workers', 'How the results come back', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'The <code>Send</code> API creates worker nodes dynamically and sends each one its own input. Each worker has its own state.',
      back: 'All workers write to a shared state key, with a reducer that accumulates the results (for example, <code>Annotated[list, operator.add]</code>). The orchestrator reads that key.',
      api: '<code>Send</code>, reducers'
    },
    {
      fw: 'LangChain (subagents)',
      how: 'The main agent calls the subagents as tools; each call carries its own instruction.',
      back: 'Each result comes back to the main agent as the tool response.',
      api: '<i>Subagents</i> pattern'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> runs a fixed set of <code>sub_agents</code> defined in the design in parallel. For a number of workers decided at run time, the coordinator invokes them as tools (<code>AgentTool</code>) or you write a custom agent.',
      back: 'With <code>ParallelAgent</code>, each sub-agent writes to a distinct key of the session state (<code>output_key</code>). With <code>AgentTool</code>, as the tool response.',
      api: '<code>ParallelAgent</code>, <code>AgentTool</code>, <code>output_key</code>'
    }
  ],
  equiv: 'if the subtasks are fixed in the design (always the same reviewers, for example), the behavior matches <a href="05_fan_out_gather.html">pattern 5, Sectioning and fan-out/gather</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Orchestrator-worker section). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ],
  toolNotes: {
    orq: {
      create_worker: 'LangGraph: <code>Send</code> creates one worker node per subtask. LangChain: subagents as tools. ADK: <code>AgentTool</code> or a custom agent (<code>ParallelAgent</code> only works for a fixed number of workers).'
    }
  }
};
