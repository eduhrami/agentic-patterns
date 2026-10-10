window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the order of the four agents is fixed in the design, all of them read from and write to a shared state, and a gate in code checks the draft between the second and third steps. A3 and A4 receive the original request in addition to the draft.',
  cols: ['Framework', 'How it fixes the order', 'What each agent receives', 'Check between steps (gate)'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>SequentialAgent</code> runs its <code>sub_agents</code> in the order they are declared.',
      back: 'Shared session state: each agent writes its result (usually with <code>output_key</code>) and the following ones read it from the state.',
      api: 'A custom agent (<code>BaseAgent</code>) between the steps that checks the state with code.'
    },
    {
      fw: 'LangGraph',
      how: 'Prompt chaining: nodes connected with edges in order.',
      back: 'The graph state, shared by all the nodes.',
      api: 'A gate function (the official example is <code>check_punchline</code>) wired with <code>add_conditional_edges()</code>: it decides in code whether to continue or branch off.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: '<code>SequentialBuilder</code> runs the participants in list order.',
      back: 'By default, the previous agent\'s whole conversation (what it received and what it replied). With <code>chain_only_agent_responses=True</code>, only its responses.',
      api: 'Custom executors, without an LLM, interleaved with the agents in the same sequence.'
    }
  ],
  equiv: 'if an agent chose who comes next instead of the design, the behavior would match <a href="03_coordinator_dispatcher.html">pattern 3</a> or <a href="04_handoff.html">pattern 4</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Sequential pipeline). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> (Prompt chaining). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Sequential orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ]
};
