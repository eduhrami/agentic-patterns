window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'a chat manager gives the turns with a tool (<code>give_turn</code>), everyone reads the same thread and the discussion ends when nobody has objections or after 6 rounds.',
  cols: ['Framework', 'Who decides the next turn', 'What each participant sees', 'How it ends'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'An orchestrator in the middle (star topology). It can pick in fixed turns, with its own function (<code>selection_func</code>) or with an LLM agent (<code>orchestrator_agent</code>).',
      back: 'The whole conversation history: the orchestrator syncs each agent\'s session before its turn. Tool calls are filtered out before forwarding.',
      api: '<code>termination_condition</code> in <code>GroupChatBuilder</code>; in .NET, the manager\'s <code>MaximumIterationCount</code>.'
    },
    {
      fw: 'LangGraph',
      how: 'No predefined group chat orchestration. You build it with a supervisor that picks the next participant.',
      back: 'The list of messages in the graph state, shared by all the nodes.',
      api: 'A conditional edge to the end; <code>recursion_limit</code> as a safeguard.'
    }
  ],
  equiv: 'if the manager also planned and kept a task ledger, the behavior would match <a href="10_magentic.html">pattern 10, Magentic</a>, which Microsoft describes as the same architecture with a manager that plans.',
  sources: [
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>',
    'Microsoft. <i>Magentic orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/magentic</a>',
    'LangChain. <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/graph-api" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/graph-api</a>'
  ],
  toolNotes: {
    man: {
      give_turn: 'Agent Framework: <code>selection_func</code> or <code>orchestrator_agent</code> in <code>GroupChatBuilder</code>. LangGraph: a supervisor.',
      close_discussion: 'Agent Framework: <code>termination_condition</code> and a maximum number of turns. LangGraph: a conditional edge to the end.'
    }
  }
};
