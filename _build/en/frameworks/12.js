window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the generator is an LLM and the critic is a program with three rules that returns "PASS" or the list of errors; the loop repeats until it passes.',
  cols: ['Framework', 'Where the critic (program) lives', 'How the errors go back to the generator', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<i>Generate and review</i> pattern: a generator and a reviewer in a <code>SequentialAgent</code>. For the reviewer to be code rather than an LLM, you write it as a custom agent (<code>BaseAgent</code>).',
      back: 'The generator saves its output with <code>output_key</code>; the reviewer reads it from the state and can save its errors in another key. To repeat until approval, both go inside a <code>LoopAgent</code>.',
      api: '<code>SequentialAgent</code>, <code>LoopAgent</code>, <code>BaseAgent</code>, <code>output_key</code>'
    },
    {
      fw: 'LangGraph',
      how: 'A node or a gate function written in code, like the gate in prompt chaining.',
      back: 'The errors stay in the graph state; a conditional edge goes back to the generator node or ends.',
      api: '<code>add_conditional_edges()</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'A custom executor, without an LLM, in the same workflow as the generator agent.',
      back: 'Through the workflow edges that connect the executor with the agent.',
      api: '<code>Executor</code>, <code>WorkflowBuilder</code>'
    }
  ],
  equiv: 'if the critic were an LLM giving natural language feedback, the behavior would match <a href="11_evaluator_optimizer.html">pattern 11, Evaluator-optimizer</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Generate and review; Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Sequential orchestration</i> (custom executors). Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ]
};
