window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el orquestador consulta los datos, crea un worker por región con una herramienta (<code>crear_worker</code>) y cada worker le devuelve un resultado estructurado. El número de workers se decide durante la ejecución, no en el diseño.',
  cols: ['Framework', 'Cómo crea los workers', 'Cómo regresan los resultados', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'La API <code>Send</code> crea nodos worker de forma dinámica y le envía a cada uno su propia entrada. Cada worker tiene su propio estado.',
      back: 'Todos los workers escriben en una clave compartida del estado, con un <i>reducer</i> que acumula los resultados (por ejemplo, <code>Annotated[list, operator.add]</code>). El orquestador lee esa clave.',
      api: '<code>Send</code>, <i>reducers</i>'
    },
    {
      fw: 'LangChain (subagentes)',
      how: 'El agente principal llama a los subagentes como herramientas; cada llamada lleva su propia instrucción.',
      back: 'Cada resultado regresa al agente principal como respuesta de la herramienta.',
      api: 'Patrón <i>Subagents</i>'
    },
    {
      fw: 'Google ADK',
      how: '<code>ParallelAgent</code> ejecuta en paralelo un conjunto fijo de <code>sub_agents</code> definido en el diseño. Para un número de workers que se decide en ejecución, el coordinador los invoca como herramientas (<code>AgentTool</code>) o se escribe un agente personalizado.',
      back: 'Con <code>ParallelAgent</code>, cada subagente escribe en una clave distinta del estado de la sesión (<code>output_key</code>). Con <code>AgentTool</code>, como respuesta de la herramienta.',
      api: '<code>ParallelAgent</code>, <code>AgentTool</code>, <code>output_key</code>'
    }
  ],
  equiv: 'si las subtareas están fijas desde el diseño (siempre los mismos revisores, por ejemplo), el comportamiento corresponde al <a href="05_fan_out_gather.html">patrón 5, Sectioning y fan-out/gather</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (sección Orchestrator-worker). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'Google. <i>Multi-agent patterns</i> (Parallel fan-out and gather). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>'
  ],
  toolNotes: {
    orq: {
      crear_worker: 'LangGraph: <code>Send</code> crea un nodo worker por subtarea. LangChain: subagentes como herramientas. ADK: <code>AgentTool</code> o un agente personalizado (<code>ParallelAgent</code> solo sirve para un número fijo de workers).'
    }
  }
};
