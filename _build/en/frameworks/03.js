window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the coordinator delegates with a tool (<code>transfer_to_agent</code>) and the specialist hands control back when it finishes. This is the "agent as a tool" behavior, and the demo uses it the same way in every pattern so the flow stays uniform. Note that the name matches ADK\'s function, but in ADK\'s default mode control does not come back on its own (see the first row).',
  rows: [
    {
      fw: 'Google ADK (transfer)',
      how: 'When you declare <code>sub_agents</code>, ADK gives the coordinator the <code>transfer_to_agent</code> function. Its LLM calls it with the specialist\'s name, chosen from the descriptions.',
      back: 'No, by default (<code>chat</code> mode): the specialist keeps control until it transfers back with another <code>transfer_to_agent</code>.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    },
    {
      fw: 'Google ADK 2.0 (collaboration modes)',
      how: 'ADK generates a delegation tool named after each sub-agent.',
      back: 'Depends on the mode: manual in <code>chat</code>, automatic in <code>task</code> (via <code>finish_task</code>) and in <code>single_turn</code> (with the result).',
      api: '<code>mode="task"</code>, <code>mode="single_turn"</code>'
    },
    {
      fw: 'Google ADK (agent as a tool)',
      how: 'The specialist is wrapped as a tool of the coordinator.',
      back: 'Yes: its result comes back as the tool response.',
      api: '<code>AgentTool</code>'
    },
    {
      fw: 'LangChain (subagents)',
      how: 'The main agent calls the subagents as tools; all routing goes through it.',
      back: 'Yes: the results flow back to the main agent.',
      api: '<i>Subagents</i> pattern'
    },
    {
      fw: 'LangGraph (supervisor)',
      how: 'Handoff tools <code>transfer_to_&lt;agent&gt;</code> that return <code>Command(goto=..., graph=Command.PARENT)</code>.',
      back: 'Yes: when each agent finishes, the supervisor gets control back and decides the next step.',
      api: '<code>langgraph-supervisor</code> (the library now recommends implementing the supervisor directly with tools)'
    }
  ],
  equiv: 'if the specialist keeps control and the coordinator no longer takes part (as in ADK\'s default transfer), the behavior matches <a href="04_handoff.html">pattern 4, Handoff</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'Google. <i>Build collaborative agent teams</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/collaboration.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../collaboration.md</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'LangChain. <i>langgraph-supervisor</i>. <a href="https://pypi.org/project/langgraph-supervisor/" target="_blank" rel="noopener">pypi.org/project/langgraph-supervisor</a>'
  ],
  toolNotes: {
    coord: {
      transfer_to_agent: 'ADK: <code>transfer_to_agent</code> (no automatic return in the default mode) or <code>AgentTool</code> (returns). LangChain/LangGraph: subagents as tools, or <code>transfer_to_&lt;agent&gt;</code> with a supervisor.'
    }
  }
};
