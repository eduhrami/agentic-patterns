window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'a classifier returns a category and a confidence in JSON; a code rule applies the 0.70 threshold and sends the original message to the chosen branch.',
  cols: ['Framework', 'Who decides the branch', 'Where a rule like the threshold goes', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'An LLM with structured output returns the routing decision.',
      back: 'In the conditional edge function, which is code and picks the next node.',
      api: '<code>with_structured_output()</code>, <code>add_conditional_edges()</code>'
    },
    {
      fw: 'LangChain (router)',
      how: 'A routing step classifies the input and directs it to one or more specialized agents; the results are combined into one response.',
      back: 'In the routing step.',
      api: '<i>Router</i> pattern'
    },
    {
      fw: 'Google ADK',
      how: '<code>RoutedAgent</code>: a routing function written in code picks one agent per invocation. If the chosen agent fails, the function is called again to pick a fallback.',
      back: 'Inside the routing function.',
      api: '<code>RoutedAgent</code> (TypeScript, experimental)'
    },
    {
      fw: 'Google ADK (LLM delegation)',
      how: 'Alternative: a coordinator with <code>sub_agents</code> decides with <code>transfer_to_agent</code> based on the descriptions.',
      back: 'There is no threshold in code: the LLM decides.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    }
  ],
  equiv: 'if instead of a classifier and a rule a coordinator agent decided and also stayed in the conversation, the behavior would match <a href="03_coordinator_dispatcher.html">pattern 3, Coordinator/dispatcher</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Routing). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'LangChain. <i>Multi-agent</i> (Router). <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'Google. <i>Route between agents</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/agents/routing.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../routing.md</a>'
  ]
};
