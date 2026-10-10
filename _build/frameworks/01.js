window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el orden de los cuatro agentes está fijo en el diseño, todos leen y escriben en un estado compartido y un gate en código revisa el borrador entre el segundo y el tercer paso. A3 y A4 reciben la solicitud original además del borrador.',
  cols: ['Framework', 'Cómo fija el orden', 'Qué recibe cada agente', 'Verificación entre pasos (gate)'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>SequentialAgent</code> ejecuta sus <code>sub_agents</code> en el orden en que se declaran.',
      back: 'Estado compartido de la sesión: cada agente escribe su resultado (normalmente con <code>output_key</code>) y los siguientes lo leen del estado.',
      api: 'Un agente personalizado (<code>BaseAgent</code>) entre los pasos que revisa el estado con código.'
    },
    {
      fw: 'LangGraph',
      how: 'Encadenamiento de prompts (<i>prompt chaining</i>): nodos unidos con aristas en orden.',
      back: 'El estado del grafo, que comparten todos los nodos.',
      api: 'Una función de compuerta (el ejemplo oficial es <code>check_punchline</code>) conectada con <code>add_conditional_edges()</code>: decide en código si se continúa o se desvía.'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: '<code>SequentialBuilder</code> ejecuta a los participantes en el orden de la lista.',
      back: 'Por defecto, toda la conversación del agente anterior (lo que recibió y lo que respondió). Con <code>chain_only_agent_responses=True</code>, solo sus respuestas.',
      api: 'Executors personalizados, sin LLM, intercalados con los agentes en la misma secuencia.'
    }
  ],
  equiv: 'si un agente eligiera quién sigue en lugar del diseño, el comportamiento correspondería al <a href="03_coordinator_dispatcher.html">patrón 3</a> o al <a href="04_handoff.html">patrón 4</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Sequential pipeline). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> (Prompt chaining). LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Sequential orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ]
};
