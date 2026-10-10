window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'un crítico escribe notas con severidad, un refinador reescribe el código y el ciclo termina cuando ya no hay notas medias o altas, o al llegar a 3 iteraciones.',
  cols: ['Framework', 'Cómo itera', 'Cómo termina', 'API'],
  rows: [
    {
      fw: 'Google ADK',
      how: '<code>LoopAgent</code> con los agentes que trabajan en cada vuelta; leen y guardan la versión en el estado de la sesión. El ejemplo oficial es casi el mismo caso: un refinador de código, un revisor de calidad y un agente que detiene el ciclo.',
      back: 'Al llegar a <code>max_iterations</code> o cuando un agente personalizado marca <code>escalate=True</code> porque el resultado ya es suficiente.',
      api: '<code>LoopAgent</code>, <code>max_iterations</code>, <code>escalate</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Un ciclo en el grafo: generador, crítico y refinador conectados, con una arista condicional que decide si se da otra vuelta.',
      back: 'Cuando la condición de salida se cumple en la función de la arista. <code>recursion_limit</code> corta el grafo si el ciclo no termina.',
      api: '<code>add_conditional_edges()</code>, <code>recursion_limit</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Group chat con un manager que decide quién habla; en turnos fijos, un <code>RoundRobinGroupChatManager</code>.',
      back: 'Con una condición de terminación propia del manager y un número máximo de turnos.',
      api: '<code>GroupChatBuilder</code>, <code>termination_condition</code>, <code>MaximumIterationCount</code>'
    }
  ],
  equiv: 'si el crítico solo aprobara o rechazara, sin notas de mejora, el comportamiento correspondería al <a href="12_generator_critic.html">patrón 12, Generator-critic</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Iterative refinement). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Workflows and agents</i> y <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/workflows-agents" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/workflows-agents</a>',
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>'
  ]
};
