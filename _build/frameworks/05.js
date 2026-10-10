window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'tres revisores fijos reciben el mismo diff al mismo tiempo, cada uno escribe en su propia clave del estado y un sintetizador combina los tres reportes.',
  cols: ['Framework', 'Cómo corre en paralelo', 'Dónde quedan los resultados', 'Cómo se combinan (gather)'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> ejecuta sus <code>sub_agents</code> al mismo tiempo; suele ir dentro de un <code>SequentialAgent</code>.',
      back: 'Cada subagente escribe en una clave distinta del estado compartido de la sesión (<code>output_key</code>).',
      api: 'El siguiente agente del <code>SequentialAgent</code> lee las claves y combina.'
    },
    {
      fw: 'LangGraph',
      how: 'Aristas desde <code>START</code> hacia cada nodo; los nodos sin dependencia entre sí corren en paralelo.',
      back: 'En el estado del grafo.',
      api: 'Un nodo agregador (<code>aggregator</code>) que combina los resultados de todas las ramas.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: '<code>ConcurrentBuilder</code>: todos los participantes procesan la misma entrada de forma independiente.',
      back: 'El agregador por defecto devuelve un mensaje por participante.',
      api: 'Un agregador personalizado con <code>with_aggregator()</code>, por ejemplo un agente que resume.'
    }
  ],
  equiv: 'si el número de revisores se decidiera durante la ejecución, el comportamiento correspondería al <a href="08_orchestrator_workers.html">patrón 8, Orchestrator-workers</a>. Si todos respondieran la misma pregunta y una regla contara los votos, sería el <a href="06_voting.html">patrón 6, Voting</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> (Parallelization). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>'
  ]
};
