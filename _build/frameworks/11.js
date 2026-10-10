window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el traductor y el evaluador se turnan: el evaluador revisa contra tres criterios, devuelve retroalimentación y el ciclo termina al aprobar o al llegar al límite de 3 iteraciones.',
  cols: ['Framework', 'Cómo itera', 'Cómo termina', 'API'],
  rows: [
    {
      fw: 'LangGraph',
      how: 'Patrón <i>evaluator-optimizer</i>: un LLM evaluador con salida estructurada devuelve una calificación y retroalimentación; una arista condicional regresa al generador si no aprueba.',
      back: 'Cuando el evaluador aprueba. Como respaldo, <code>recursion_limit</code> corta el grafo si el ciclo no termina.',
      api: '<code>with_structured_output()</code>, <code>add_conditional_edges()</code>'
    },
    {
      fw: 'Google ADK',
      how: '<code>LoopAgent</code> que contiene al generador y al evaluador; el evaluador guarda su retroalimentación en el estado de la sesión.',
      back: 'Al llegar a <code>max_iterations</code> o cuando un agente marca <code>escalate=True</code> en sus acciones de evento.',
      api: '<code>LoopAgent</code>, <code>max_iterations</code>, <code>escalate</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Group chat en turnos alternados (<i>round-robin</i>) entre escritor y revisor: el ejemplo de la documentación es un redactor de eslóganes y un revisor.',
      back: 'Con un manager personalizado que termina cuando el revisor aprueba, más un número máximo de turnos.',
      api: '<code>RoundRobinGroupChatManager</code>, <code>ShouldTerminateAsync</code>, <code>MaximumIterationCount</code>'
    }
  ],
  equiv: 'si el evaluador fuera un programa con reglas de aprobado o rechazado, el comportamiento correspondería al <a href="12_generator_critic.html">patrón 12, Generator-critic</a>. Si entregara notas con severidad a un tercer agente que reescribe, sería el <a href="13_iterative_refinement.html">patrón 13, Iterative refinement</a>.',
  sources: [
    'LangChain. <i>Workflows and agents</i> (Evaluator-optimizer) y <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Google. <i>Multi-agent patterns</i> (Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>'
  ]
};
