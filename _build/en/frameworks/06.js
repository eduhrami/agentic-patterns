window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'three voters with different prompts receive the same fragment in parallel and a code rule ("any") counts the votes. No voter sees the others\' votes.',
  cols: ['Framework', 'How it runs the voters', 'Where the votes are counted', 'API'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'Concurrent orchestration: all participants process the same input independently. The documentation lists voting systems as one of its uses.',
      back: 'In a custom aggregator: a function that receives the responses of all the participants and can apply the rule in code.',
      api: '<code>ConcurrentBuilder(...).with_aggregator(...)</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Parallelization: edges from <code>START</code> to each voter. The documentation presents it to gain speed or to increase confidence in the result.',
      back: 'In an aggregator node written in code.',
      api: 'Parallel edges, <code>aggregator</code> node'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> with one voter per sub-agent; each one stores its vote with <code>output_key</code>.',
      back: 'In the next step of a <code>SequentialAgent</code>: a custom agent (<code>BaseAgent</code>) that reads the votes from the state and counts them.',
      api: '<code>ParallelAgent</code>, <code>SequentialAgent</code>, <code>BaseAgent</code>'
    }
  ],
  equiv: 'if each voter reviewed a different aspect and a synthesizer merged the reports, the behavior would match <a href="05_fan_out_gather.html">pattern 5, Sectioning and fan-out/gather</a>.',
  sources: [
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>',
    'LangChain. <i>Workflows and agents</i> (Parallelization). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ]
};
