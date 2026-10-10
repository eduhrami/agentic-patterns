window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'three chained patterns (coordinator/dispatcher, parallel fan-out and generator-critic) with three explicit context transfer points.',
  cols: ['Framework', 'How the patterns are composed', 'How context passes between stages', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'Workflow agents nest: a <code>ParallelAgent</code> inside a <code>SequentialAgent</code>, a <code>LoopAgent</code> as one more stage, and <code>LlmAgent</code> coordinators with <code>sub_agents</code> or <code>AgentTool</code>.',
      back: 'Through the shared session state: each stage writes with <code>output_key</code> and the next one reads from the state.',
      api: '<code>SequentialAgent</code>, <code>ParallelAgent</code>, <code>LoopAgent</code>, <code>LlmAgent</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Subgraphs: a compiled graph is used as a node of another graph.',
      back: 'If they share state keys, the subgraph reads and writes them directly. If they use different schemas, a node translates the input and output state: that is where the transfer point becomes explicit.',
      api: '<code>add_node(compiled_subgraph)</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Each orchestration is a workflow; with <code>WorkflowBuilder</code> you combine agents and executors with edges, including fan-out and fan-in edges.',
      back: 'It depends on each orchestration\'s configuration; for example, the sequential one passes the previous agent\'s whole conversation by default.',
      api: '<code>WorkflowBuilder</code>, <code>SequentialBuilder</code>, <code>ConcurrentBuilder</code>'
    }
  ],
  equiv: 'each stage has its own demo: <a href="03_coordinator_dispatcher.html">pattern 3</a>, <a href="05_fan_out_gather.html">pattern 5</a> and <a href="12_generator_critic.html">pattern 12</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Subgraphs</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/use-subgraphs" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/use-subgraphs</a>',
    'Microsoft. <i>Sequential orchestration</i> and <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ],
  toolNotes: {
    coord: {
      route: 'ADK: <code>transfer_to_agent</code> or <code>RoutedAgent</code>. LangGraph: <code>add_conditional_edges()</code> to the branch subgraph.'
    }
  }
};
