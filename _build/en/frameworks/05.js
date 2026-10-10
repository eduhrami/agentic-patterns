window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'three fixed reviewers receive the same diff at the same time, each one writes to its own state key and a synthesizer combines the three reports.',
  cols: ['Framework', 'How it runs in parallel', 'Where the results go', 'How they are combined (gather)'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> runs its <code>sub_agents</code> at the same time; it usually sits inside a <code>SequentialAgent</code>.',
      back: 'Each sub-agent writes to a distinct key of the shared session state (<code>output_key</code>).',
      api: 'The next agent in the <code>SequentialAgent</code> reads the keys and combines them.'
    },
    {
      fw: 'LangGraph',
      how: 'Edges from <code>START</code> to each node; nodes that do not depend on each other run in parallel.',
      back: 'In the graph state.',
      api: 'An aggregator node that combines the results of all the branches.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: '<code>ConcurrentBuilder</code>: all participants process the same input independently.',
      back: 'The default aggregator returns one message per participant.',
      api: 'A custom aggregator with <code>with_aggregator()</code>, for example an agent that summarizes.'
    }
  ],
  equiv: 'if the number of reviewers were decided during execution, the behavior would match <a href="08_orchestrator_workers.html">pattern 8, Orchestrator-workers</a>. If all of them answered the same question and a rule counted the votes, it would be <a href="06_voting.html">pattern 6, Voting</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> (Parallelization). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>'
  ]
};
