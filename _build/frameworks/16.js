window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'tres patrones encadenados (coordinator/dispatcher, fan-out en paralelo y generator-critic) con tres puntos de transferencia de contexto explícitos.',
  cols: ['Framework', 'Cómo se componen los patrones', 'Cómo pasa el contexto entre etapas', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'Los agentes de flujo se anidan: un <code>ParallelAgent</code> dentro de un <code>SequentialAgent</code>, un <code>LoopAgent</code> como una etapa más, y coordinadores <code>LlmAgent</code> con <code>sub_agents</code> o <code>AgentTool</code>.',
      back: 'Por el estado compartido de la sesión: cada etapa escribe con <code>output_key</code> y la siguiente lee del estado.',
      api: '<code>SequentialAgent</code>, <code>ParallelAgent</code>, <code>LoopAgent</code>, <code>LlmAgent</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Subgrafos: un grafo compilado se usa como nodo de otro grafo.',
      back: 'Si comparten claves del estado, el subgrafo lee y escribe directamente en ellas. Si usan esquemas distintos, un nodo traduce el estado de entrada y de salida: ahí queda explícito el punto de transferencia.',
      api: '<code>add_node(subgrafo_compilado)</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Cada orquestación es un flujo (<i>workflow</i>); con <code>WorkflowBuilder</code> se combinan agentes y executors con aristas, incluidas las de fan-out y fan-in.',
      back: 'Según la configuración de cada orquestación; por ejemplo, la secuencial pasa por defecto toda la conversación del agente anterior.',
      api: '<code>WorkflowBuilder</code>, <code>SequentialBuilder</code>, <code>ConcurrentBuilder</code>'
    }
  ],
  equiv: 'cada etapa tiene su propio demo: <a href="03_coordinator_dispatcher.html">patrón 3</a>, <a href="05_fan_out_gather.html">patrón 5</a> y <a href="12_generator_critic.html">patrón 12</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Subgraphs</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/use-subgraphs" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/use-subgraphs</a>',
    'Microsoft. <i>Sequential orchestration</i> y <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ],
  toolNotes: {
    coord: {
      enrutar: 'ADK: <code>transfer_to_agent</code> o <code>RoutedAgent</code>. LangGraph: <code>add_conditional_edges()</code> hacia el subgrafo de la rama.'
    }
  }
};
