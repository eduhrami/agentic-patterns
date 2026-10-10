window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'tres votantes con prompts distintos reciben el mismo fragmento en paralelo y una regla en código ("cualquiera") cuenta los votos. Ningún votante ve el voto de los otros.',
  cols: ['Framework', 'Cómo corre a los votantes', 'Dónde se cuentan los votos', 'API'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'Orquestación concurrente: todos los participantes procesan la misma entrada de forma independiente. La documentación menciona los sistemas de votación como uno de sus usos.',
      back: 'En un agregador personalizado: una función que recibe las respuestas de todos los participantes y puede aplicar la regla en código.',
      api: '<code>ConcurrentBuilder(...).with_aggregator(...)</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Paralelización: aristas desde <code>START</code> a cada votante. La documentación la presenta para ganar velocidad o para aumentar la confianza en el resultado.',
      back: 'En un nodo agregador escrito en código.',
      api: 'Aristas en paralelo, nodo <code>aggregator</code>'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> con un votante por subagente; cada uno guarda su voto con <code>output_key</code>.',
      back: 'En el siguiente paso de un <code>SequentialAgent</code>: un agente personalizado (<code>BaseAgent</code>) que lee los votos del estado y los cuenta.',
      api: '<code>ParallelAgent</code>, <code>SequentialAgent</code>, <code>BaseAgent</code>'
    }
  ],
  equiv: 'si cada votante revisara un aspecto distinto y un sintetizador uniera los reportes, el comportamiento correspondería al <a href="05_fan_out_gather.html">patrón 5, Sectioning y fan-out/gather</a>.',
  sources: [
    'Microsoft. <i>Concurrent orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/concurrent" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/concurrent</a>',
    'LangChain. <i>Workflows and agents</i> (Parallelization). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ]
};
