window.FRAMEWORKS = {
  reviewed: 'October 10, 2026',
  demo: 'a code rule pauses only the <code>request_refund</code> tool when the amount exceeds $100, saves the state in a checkpoint (CK-77) and resumes without repeating the queries. The supervisor can approve or reply with feedback.',
  cols: ['Framework', 'How it pauses', 'How the person resumes or replies', 'Condition by amount'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'Tool Confirmation: the tool pauses its execution and asks for confirmation before continuing. It is an experimental feature.',
      back: 'With a yes or no response, or with structured data (advanced confirmation). It does not work with <code>DatabaseSessionService</code> or <code>VertexAiSessionService</code>.',
      api: 'Yes: <code>FunctionTool(reimburse, require_confirmation=threshold)</code>, where <code>threshold</code> is a function that checks the amount. The official example is a reimbursement that asks for confirmation above a certain amount.'
    },
    {
      fw: 'LangGraph',
      how: '<code>interrupt()</code> inside a node stops the graph and saves the state (requires a checkpointer and a <code>thread_id</code>).',
      back: 'You invoke the graph again with <code>Command(resume=...)</code>: that value is what <code>interrupt()</code> returns, so it can be an approval or feedback. The <code>thread_id</code> resumes the same checkpoint.',
      api: 'Yes: the condition is written in code before calling <code>interrupt()</code>.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Tools marked with <code>@tool(approval_mode="always_require")</code> (Python) or <code>ApprovalRequiredAIFunction</code> (.NET): the workflow pauses and emits an approval request.',
      back: 'The application replies with the approval or the rejection. With checkpoint storage, the approval can arrive hours later and the workflow resumes from there.',
      api: 'Approval is set per tool.'
    }
  ],
  equiv: 'the pattern also appears inside others: in <a href="10_magentic.html">pattern 10, Magentic</a>, a person approves the action on production.',
  sources: [
    'Google. <i>Get action confirmation for ADK Tools</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/tools-custom/confirmation.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../confirmation.md</a>',
    'LangChain. <i>Interrupts</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/interrupts" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/interrupts</a>',
    'Microsoft. <i>Handoff orchestration</i> (tool approval, checkpointing) and <i>Sequential orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/handoff</a>'
  ],
  toolNotes: {
    ag: {
      request_refund: 'ADK: <code>FunctionTool(..., require_confirmation=threshold)</code>. LangGraph: <code>interrupt()</code> before running it. Agent Framework: <code>approval_mode="always_require"</code>.'
    }
  }
};
