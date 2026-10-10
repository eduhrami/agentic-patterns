window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the translator and the evaluator take turns: the evaluator reviews against three criteria, returns feedback and the loop ends upon approval or when the 3-iteration limit is reached.',
  cols: ['Framework', 'How it iterates', 'How it ends', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'Evaluator-optimizer pattern: an evaluator LLM with structured output returns a grade and feedback; a conditional edge goes back to the generator if it does not approve.',
      back: 'When the evaluator approves. As a safeguard, <code>recursion_limit</code> stops the graph if the loop does not end.',
      api: '<code>with_structured_output()</code>, <code>add_conditional_edges()</code>'
    },
    {
      fw: 'Google ADK',
      how: '<code>LoopAgent</code> containing the generator and the evaluator; the evaluator stores its feedback in the session state.',
      back: 'When <code>max_iterations</code> is reached or when an agent sets <code>escalate=True</code> in its event actions.',
      api: '<code>LoopAgent</code>, <code>max_iterations</code>, <code>escalate</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Group chat with alternating turns (round-robin) between writer and reviewer: the documentation\'s example is a slogan writer and a reviewer.',
      back: 'With a custom manager that ends when the reviewer approves, plus a maximum number of turns.',
      api: '<code>RoundRobinGroupChatManager</code>, <code>ShouldTerminateAsync</code>, <code>MaximumIterationCount</code>'
    }
  ],
  equiv: 'if the evaluator were a program with pass or fail rules, the behavior would match <a href="12_generator_critic.html">pattern 12, Generator-critic</a>. If it delivered notes with severity to a third agent that rewrites, it would be <a href="13_iterative_refinement.html">pattern 13, Iterative refinement</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Evaluator-optimizer) and <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Google. <i>Multi-agent patterns</i> (Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>'
  ]
};
