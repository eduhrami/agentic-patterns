window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'a critic writes notes with severity, a refiner rewrites the code and the loop ends when there are no more medium or high notes, or after 3 iterations.',
  cols: ['Framework', 'How it iterates', 'How it ends', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>LoopAgent</code> with the agents that work in each round; they read and save the version in the session state. The official example is almost the same case: a code refiner, a quality checker and an agent that stops the loop.',
      back: 'When <code>max_iterations</code> is reached or when a custom agent sets <code>escalate=True</code> because the result is good enough.',
      api: '<code>LoopAgent</code>, <code>max_iterations</code>, <code>escalate</code>'
    },
    {
      fw: 'LangGraph',
      how: 'A cycle in the graph: generator, critic and refiner connected, with a conditional edge that decides whether to go around again.',
      back: 'When the exit condition is met in the edge function. <code>recursion_limit</code> stops the graph if the loop does not end.',
      api: '<code>add_conditional_edges()</code>, <code>recursion_limit</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Group chat with a manager that decides who speaks; with fixed turns, a <code>RoundRobinGroupChatManager</code>.',
      back: 'With the manager\'s own termination condition and a maximum number of turns.',
      api: '<code>GroupChatBuilder</code>, <code>termination_condition</code>, <code>MaximumIterationCount</code>'
    }
  ],
  equiv: 'if the critic only approved or rejected, without improvement notes, the behavior would match <a href="12_generator_critic.html">pattern 12, Generator-critic</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> and <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>'
  ]
};
