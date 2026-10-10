window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'cada agente transfiere el control completo con una herramienta (<code>transferir</code>) y ya no vuelve a participar. Cada transferencia incluye el trace completo, y un contador en código limita la conversación a 5 transferencias.',
  cols: ['Framework', 'Cómo transfiere', 'Qué contexto recibe el siguiente agente', 'Límites y API'],
  rows: [
    {
      fw: 'Google ADK',
      how: 'El agente activo llama a <code>transfer_to_agent</code>. En el modo por defecto (<code>chat</code>), el agente que recibe conserva el control hasta que transfiere a otro.',
      back: 'La sesión de la conversación, que comparten los agentes.',
      api: '<code>disallow_transfer_to_parent</code> y <code>disallow_transfer_to_peers</code> restringen a quién se puede transferir. <code>RunConfig(max_llm_calls=...)</code> limita las llamadas al modelo por ejecución (500 por defecto).'
    },
    {
      fw: 'LangGraph (swarm) / LangChain (handoffs)',
      how: 'Herramientas creadas con <code>create_handoff_tool</code> que devuelven un <code>Command(goto=...)</code>. El sistema recuerda qué agente estaba activo y la siguiente interacción continúa con él (requiere un <i>checkpointer</i>).',
      back: 'Por defecto, el historial completo de mensajes más un mensaje de herramienta que confirma la transferencia.',
      api: '<code>langgraph-swarm</code>. <code>recursion_limit</code> limita los <i>super-steps</i> del grafo (1000 por defecto desde la versión 1.0.6) y lanza <code>GraphRecursionError</code>.'
    },
    {
      fw: 'OpenAI Agents SDK',
      how: 'Los handoffs se presentan al LLM como herramientas llamadas <code>transfer_to_&lt;agente&gt;</code>. El nuevo agente toma la conversación.',
      back: 'Todo el historial previo. Con <code>input_filter</code> se puede recortar lo que se reenvía.',
      api: '<code>handoffs=[...]</code>, <code>input_filter</code>'
    },
    {
      fw: 'Microsoft Agent Framework',
      how: 'Topología en malla, sin orquestador. El handoff se hace con una herramienta que el marco inyecta según las reglas de transferencia. Si el agente responde sin transferir, el control vuelve al usuario.',
      back: 'Los mensajes de usuario y de los agentes; las llamadas a herramientas, incluidas las de handoff, se filtran antes de reenviar.',
      api: '<code>HandoffBuilder</code> con <code>add_handoff</code>. El modo autónomo tiene límite de turnos por agente. Las herramientas sensibles pueden exigir aprobación humana.'
    }
  ],
  equiv: 'si el agente que transfiere recupera el control cuando el otro termina, el comportamiento corresponde al <a href="03_coordinator_dispatcher.html">patrón 3, Coordinator/dispatcher</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>, <i>LLM agents</i> y <i>Runtime config</i>. ADK Docs. <a href="https://github.com/google/adk-docs/tree/main/docs" target="_blank" rel="noopener">github.com/google/adk-docs</a>',
    'LangChain. <i>langgraph-swarm</i>. <a href="https://github.com/langchain-ai/langgraph-swarm-py" target="_blank" rel="noopener">github.com/langchain-ai/langgraph-swarm-py</a>',
    'LangChain. <i>Handoffs</i> y <i>Graph API</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent/handoffs" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent/handoffs</a>',
    'OpenAI. <i>Handoffs</i>. Agents SDK. <a href="https://openai.github.io/openai-agents-python/handoffs/" target="_blank" rel="noopener">openai.github.io/openai-agents-python/handoffs</a>',
    'Microsoft. <i>Handoff orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/handoff" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/handoff</a>'
  ],
  toolNotes: (() => {
    const n = { transferir: 'ADK: <code>transfer_to_agent</code>. LangGraph: <code>create_handoff_tool</code> (swarm). OpenAI Agents SDK: <code>transfer_to_&lt;agente&gt;</code>. Agent Framework: herramienta de handoff que agrega <code>HandoffBuilder</code>.' };
    return { tri: n, red: n, fin: n };
  })()
};
