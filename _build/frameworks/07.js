window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el orquestador elige qué analistas invocar con una herramienta (<code>invocar_analistas</code>), los analistas corren en paralelo y una fórmula en código combina sus puntajes.',
  cols: ['Framework', 'Cómo elige a quién invocar', 'Cómo combina los resultados', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'La API <code>Send</code> envía la solicitud solo a los nodos elegidos, decididos durante la ejecución; cada uno corre con su propia entrada.',
      back: 'Los resultados se acumulan en una clave del estado con un <i>reducer</i>; un nodo posterior aplica la fórmula en código.',
      api: '<code>Send</code>, <i>reducers</i>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'En <code>ConcurrentBuilder</code> los participantes se fijan al construir el flujo. Para elegirlos en ejecución hay que armar un flujo propio con aristas de fan-out.',
      back: 'Un agregador personalizado (<code>with_aggregator</code>) puede aplicar la fórmula ponderada sin LLM.',
      api: '<code>ConcurrentBuilder</code>, <code>with_aggregator</code>, <code>WorkflowBuilder</code>'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> corre un conjunto fijo. Para elegir en ejecución, un coordinador invoca solo a los analistas necesarios como herramientas (<code>AgentTool</code>) o se escribe un agente personalizado.',
      back: 'Los puntajes quedan en el estado de la sesión o como respuestas de herramienta; un agente personalizado aplica la fórmula.',
      api: '<code>AgentTool</code>, <code>BaseAgent</code>, <code>ParallelAgent</code>'
    }
  ],
  equiv: 'si siempre se invocara a todos los analistas, el comportamiento correspondería al <a href="05_fan_out_gather.html">patrón 5</a>. El analista fundamental, que consulta a sus propios sub-agentes, es un caso del <a href="09_hierarchical.html">patrón 9, Hierarchical decomposition</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Orchestrator-worker). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>',
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ],
  toolNotes: {
    orq: {
      invocar_analistas: 'LangGraph: <code>Send</code> solo a los analistas elegidos. Agent Framework: <code>ConcurrentBuilder</code> fija a los participantes; la selección requiere un flujo propio. ADK: <code>AgentTool</code> por cada analista elegido.'
    }
  }
};
