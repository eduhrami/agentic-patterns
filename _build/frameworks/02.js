window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'un clasificador devuelve una categoría y una confianza en JSON; una regla en código aplica el umbral de 0.70 y envía el mensaje original a la rama elegida.',
  cols: ['Framework', 'Quién decide la rama', 'Dónde se aplica una regla como el umbral', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'Un LLM con salida estructurada devuelve la decisión de ruteo.',
      back: 'En la función de la arista condicional, que es código y elige el siguiente nodo.',
      api: '<code>with_structured_output()</code>, <code>add_conditional_edges()</code>'
    },
    {
      fw: 'LangChain (router)',
      how: 'Un paso de ruteo clasifica la entrada y la dirige a uno o varios agentes especializados; los resultados se combinan en una respuesta.',
      back: 'En el paso de ruteo.',
      api: 'Patrón <i>Router</i>'
    },
    {
      fw: 'Google ADK',
      how: '<code>RoutedAgent</code>: una función de ruteo escrita en código elige un agente por invocación. Si el agente elegido falla, la función se llama de nuevo para elegir un respaldo.',
      back: 'Dentro de la función de ruteo.',
      api: '<code>RoutedAgent</code> (TypeScript, experimental)'
    },
    {
      fw: 'Google ADK (delegación por LLM)',
      how: 'Alternativa: un coordinador con <code>sub_agents</code> decide con <code>transfer_to_agent</code> a partir de las descripciones.',
      back: 'No hay un umbral en código: decide el LLM.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    }
  ],
  equiv: 'si en lugar de un clasificador y una regla decidiera un agente coordinador que además sigue en la conversación, el comportamiento correspondería al <a href="03_coordinator_dispatcher.html">patrón 3, Coordinator/dispatcher</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Routing). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'LangChain. <i>Multi-agent</i> (Router). <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'Google. <i>Route between agents</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/agents/routing.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../routing.md</a>'
  ]
};
