window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'the manager assigns tasks with a tool (<code>assign_task</code>), keeps the plan in a task ledger (<code>update_ledger</code>) and asks for approval before an action on production (<code>request_approval</code>).',
  cols: ['Framework', 'How it coordinates', 'Plan ledger and human approval', 'API'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'Magentic orchestration, based on AutoGen\'s Magentic-One. A manager chooses which agent acts in each round. If it detects that the team is not making progress, it resets and replans.',
      back: 'A task ledger with the plan and a progress ledger per round (is the request satisfied?, is there a loop?, is progress being made?, next agent and instruction). Optional human review of the plan: approve or request changes. Sensitive tools can require approval.',
      api: '<code>MagenticBuilder</code> with <code>max_round_count</code>, <code>max_stall_count</code>, <code>max_reset_count</code> and <code>enable_plan_review</code> (Python, off by default) or <code>RequirePlanSignoff</code> (.NET, on by default).'
    },
    {
      fw: 'Google ADK',
      how: 'No predefined Magentic orchestration. You build it with a coordinator that delegates with <code>AgentTool</code> or <code>transfer_to_agent</code>.',
      back: 'The ledger lives in the session state. Approval is implemented with Tool Confirmation (<code>require_confirmation</code>, experimental), with your own tool that pauses execution, or with a <code>SecurityPlugin</code> and a <code>PolicyEngine</code> that ask for confirmation before a tool runs (the recommended approach in TypeScript; planned for other languages).',
      api: '<code>AgentTool</code>, session state, <code>SecurityPlugin</code>'
    },
    {
      fw: 'LangGraph',
      how: 'No predefined Magentic orchestration. You build it with a supervisor or a planning node that decides the next agent.',
      back: 'The ledger lives in the graph state. Approval uses <code>interrupt()</code>, which pauses execution and saves the state; it resumes with <code>Command(resume=...)</code> (requires a checkpointer).',
      api: 'Graph state, <code>interrupt()</code>, <code>Command(resume=...)</code>'
    }
  ],
  equiv: 'Microsoft describes Magentic as the same architecture as <a href="14_group_chat.html">pattern 14, Group chat</a>, with a manager that plans. Approving a single action is <a href="15_human_in_the_loop.html">pattern 15, Human-in-the-loop</a>.',
  sources: [
    'Microsoft. <i>Magentic orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/magentic</a>',
    'Google. <i>Multi-agent patterns</i> (Human-in-the-loop). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'Google. <i>Get action confirmation for ADK Tools</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/tools-custom/confirmation.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../confirmation.md</a>',
    'LangChain. <i>Interrupts</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/interrupts" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/interrupts</a>'
  ],
  toolNotes: {
    man: {
      assign_task: 'Agent Framework: the Magentic manager picks the next agent and its instruction in the progress ledger. ADK: <code>AgentTool</code> or <code>transfer_to_agent</code>. LangGraph: a supervisor.',
      update_ledger: 'Agent Framework: built-in task ledger and progress ledger. ADK and LangGraph: the ledger lives in the state.',
      request_approval: 'Agent Framework: plan review (<code>enable_plan_review</code>) or tools that require approval. ADK: <code>require_confirmation</code> on the tool, or <code>SecurityPlugin</code> with <code>PolicyEngine</code> (TypeScript). LangGraph: <code>interrupt()</code>.'
    }
  }
};
