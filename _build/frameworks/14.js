window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'un chat manager da los turnos con una herramienta (<code>dar_turno</code>), todos leen el mismo hilo y la discusión termina cuando nadie tiene objeciones o al llegar a 6 rondas.',
  cols: ['Framework', 'Quién decide el siguiente turno', 'Qué ve cada participante', 'Cómo termina'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'Un orquestador en el centro (topología de estrella). Puede elegir en turnos fijos, con una función propia (<code>selection_func</code>) o con un agente LLM (<code>orchestrator_agent</code>).',
      back: 'Todo el historial de la conversación: el orquestador sincroniza la sesión de cada agente antes de su turno. Las llamadas a herramientas se filtran antes de reenviar.',
      api: '<code>termination_condition</code> en <code>GroupChatBuilder</code>; en .NET, <code>MaximumIterationCount</code> del manager.'
    },
    {
      fw: 'LangGraph',
      how: 'Sin una orquestación de group chat predefinida. Se arma con un supervisor que elige al siguiente participante.',
      back: 'La lista de mensajes del estado del grafo, que comparten todos los nodos.',
      api: 'Una arista condicional hacia el final; <code>recursion_limit</code> como respaldo.'
    }
  ],
  equiv: 'si el manager además planeara y llevara un registro de tareas, el comportamiento correspondería al <a href="10_magentic.html">patrón 10, Magentic</a>, que Microsoft describe como la misma arquitectura con un manager que planea.',
  sources: [
    'Microsoft. <i>Group chat orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/group-chat" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/group-chat</a>',
    'Microsoft. <i>Magentic orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/magentic</a>',
    'LangChain. <i>Graph API</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/graph-api" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/graph-api</a>'
  ],
  toolNotes: {
    man: {
      dar_turno: 'Agent Framework: <code>selection_func</code> u <code>orchestrator_agent</code> en <code>GroupChatBuilder</code>. LangGraph: un supervisor.',
      cerrar_discusion: 'Agent Framework: <code>termination_condition</code> y número máximo de turnos. LangGraph: una arista condicional hacia el final.'
    }
  }
};
