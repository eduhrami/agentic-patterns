window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'una regla en código pausa solo la herramienta <code>solicitar_reembolso</code> cuando el monto supera $100, guarda el estado en un punto de control (CK-77) y reanuda sin repetir las consultas. La supervisora puede aprobar o responder con retroalimentación.',
  cols: ['Framework', 'Cómo pausa', 'Cómo reanuda o responde la persona', 'Condición por monto'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<i>Tool Confirmation</i>: la herramienta pausa su ejecución y pide confirmación antes de continuar. Es una función experimental.',
      back: 'Con una respuesta de sí o no, o con datos estructurados (confirmación avanzada). No funciona con <code>DatabaseSessionService</code> ni con <code>VertexAiSessionService</code>.',
      api: 'Sí: <code>FunctionTool(reimburse, require_confirmation=umbral)</code>, donde <code>umbral</code> es una función que revisa el monto. El ejemplo oficial es un reembolso que pide confirmación arriba de cierto monto.'
    },
    {
      fw: 'LangGraph',
      how: '<code>interrupt()</code> dentro de un nodo detiene el grafo y guarda el estado (requiere un <i>checkpointer</i> y un <code>thread_id</code>).',
      back: 'Se vuelve a invocar el grafo con <code>Command(resume=...)</code>: ese valor es lo que regresa <code>interrupt()</code>, así que puede ser una aprobación o retroalimentación. El <code>thread_id</code> retoma el mismo punto de control.',
      api: 'Sí: la condición se escribe en código antes de llamar a <code>interrupt()</code>.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Herramientas marcadas con <code>@tool(approval_mode="always_require")</code> (Python) o <code>ApprovalRequiredAIFunction</code> (.NET): el flujo se pausa y emite una solicitud de aprobación.',
      back: 'La aplicación responde con la aprobación o el rechazo. Con almacenamiento de puntos de control, la aprobación puede llegar horas después y el flujo se reanuda desde ahí.',
      api: 'La aprobación se marca por herramienta.'
    }
  ],
  equiv: 'el patrón también aparece dentro de otros: en el <a href="10_magentic.html">patrón 10, Magentic</a>, una persona aprueba la acción sobre producción.',
  sources: [
    'Google. <i>Get action confirmation for ADK Tools</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/tools-custom/confirmation.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../confirmation.md</a>',
    'LangChain. <i>Interrupts</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/interrupts" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/interrupts</a>',
    'Microsoft. <i>Handoff orchestration</i> (tool approval, checkpointing) y <i>Sequential orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/handoff</a>'
  ],
  toolNotes: {
    ag: {
      solicitar_reembolso: 'ADK: <code>FunctionTool(..., require_confirmation=umbral)</code>. LangGraph: <code>interrupt()</code> antes de ejecutar. Agent Framework: <code>approval_mode="always_require"</code>.'
    }
  }
};
