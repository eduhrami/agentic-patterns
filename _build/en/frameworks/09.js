window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'L1 uses L2 as a tool (<code>research_assistant</code>) and L2 uses the L3 agents as tools. Each result comes back to the level above, and the intermediate work stays in the context of the level that did it.',
  rows: [
    {
      fw: 'Google ADK (agent as a tool)',
      how: 'Each level wraps the level below with <code>AgentTool</code>. The official example of the hierarchical pattern is the same case as the demo: <code>ReportWriter</code> uses <code>ResearchAssistant</code>, which uses <code>WebSearch</code> and <code>Summarizer</code>.',
      back: 'Yes: the results go up the hierarchy as tool responses or through state.',
      api: '<code>AgentTool</code>'
    },
    {
      fw: 'Google ADK (transfer)',
      how: 'An alternative mentioned in the same documentation: declare the level below as <code>sub_agents</code> and delegate with <code>transfer_to_agent</code>.',
      back: 'Not automatically in the default mode (<code>chat</code>): control stays with the lower level until it transfers back.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    },
    {
      fw: 'LangGraph (supervisor)',
      how: 'Multi-level hierarchies: a supervisor that manages other supervisors, each with its own agents.',
      back: 'Yes: each supervisor gets control back when its agents finish.',
      api: '<code>langgraph-supervisor</code> (nested <code>create_supervisor</code>)'
    },
    {
      fw: 'LangChain (subagents)',
      how: 'The main agent calls the subagents as tools.',
      back: 'Yes: the results flow back to the main agent.',
      api: '<i>Subagents</i> pattern'
    }
  ],
  equiv: 'if L1 handed over the whole task and stopped taking part, the behavior would match <a href="04_handoff.html">pattern 4, Handoff</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Hierarchical task decomposition). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>langgraph-supervisor</i> (Multi-level hierarchies). <a href="https://github.com/langchain-ai/langgraph-supervisor-py" target="_blank" rel="noopener">github.com/langchain-ai/langgraph-supervisor-py</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>'
  ],
  toolNotes: {
    n1: {
      research_assistant: 'ADK: <code>AgentTool(agent=research_assistant)</code>, as in the official example of the hierarchical pattern. LangGraph: a supervisor that manages other supervisors.'
    },
    n2: {
      internal_search: 'ADK: <code>AgentTool</code> at each level. LangGraph: the mid-level supervisor with its own agents.',
      summarizer: 'ADK: <code>AgentTool</code> at each level. LangGraph: the mid-level supervisor with its own agents.'
    }
  }
};
