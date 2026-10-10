window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el generador es un LLM y el crítico es un programa con tres reglas que devuelve "PASS" o la lista de errores; el ciclo se repite hasta que pasa.',
  cols: ['Framework', 'Dónde vive el crítico (programa)', 'Cómo regresa el error al generador', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'Patrón <i>generate and review</i>: un generador y un revisor en un <code>SequentialAgent</code>. Para que el revisor sea código y no un LLM, se escribe como agente personalizado (<code>BaseAgent</code>).',
      back: 'El generador guarda su salida con <code>output_key</code>; el revisor la lee del estado y puede guardar sus errores en otra clave. Para repetir hasta aprobar, ambos van dentro de un <code>LoopAgent</code>.',
      api: '<code>SequentialAgent</code>, <code>LoopAgent</code>, <code>BaseAgent</code>, <code>output_key</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Un nodo o una función de compuerta escrita en código, como la compuerta del encadenamiento de prompts.',
      back: 'Los errores quedan en el estado del grafo; una arista condicional regresa al nodo generador o termina.',
      api: '<code>add_conditional_edges()</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Un executor personalizado, sin LLM, en el mismo flujo que el agente generador.',
      back: 'Por las aristas del flujo, que conectan el executor con el agente.',
      api: '<code>Executor</code>, <code>WorkflowBuilder</code>'
    }
  ],
  equiv: 'si el crítico fuera un LLM que da retroalimentación en lenguaje natural, el comportamiento correspondería al <a href="11_evaluator_optimizer.html">patrón 11, Evaluator-optimizer</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Generate and review; Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Sequential orchestration</i> (custom executors). Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/sequential" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/sequential</a>'
  ]
};
