window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'N1 usa a N2 como herramienta (<code>asistente_investigacion</code>) y N2 usa a los agentes de N3 como herramientas. Cada resultado regresa al nivel superior, y el trabajo intermedio se queda en el contexto del nivel que lo hizo.',
  rows: [
    {
      fw: 'Google ADK (agente como herramienta)',
      how: 'Cada nivel envuelve al nivel inferior con <code>AgentTool</code>. El ejemplo oficial del patrón jerárquico es el mismo caso del demo: <code>ReportWriter</code> usa a <code>ResearchAssistant</code>, que usa a <code>WebSearch</code> y <code>Summarizer</code>.',
      back: 'Sí: los resultados suben por la jerarquía como respuestas de herramienta o a través del estado.',
      api: '<code>AgentTool</code>'
    },
    {
      fw: 'Google ADK (transferencia)',
      how: 'Alternativa que menciona la misma documentación: declarar al nivel inferior como <code>sub_agents</code> y delegar con <code>transfer_to_agent</code>.',
      back: 'No automáticamente en el modo por defecto (<code>chat</code>): el control se queda en el nivel inferior hasta que transfiere de vuelta.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    },
    {
      fw: 'LangGraph (supervisor)',
      how: 'Jerarquías de varios niveles: un supervisor que administra a otros supervisores, cada uno con sus agentes.',
      back: 'Sí: cada supervisor recibe el control cuando sus agentes terminan.',
      api: '<code>langgraph-supervisor</code> (<code>create_supervisor</code> anidado)'
    },
    {
      fw: 'LangChain (subagentes)',
      how: 'El agente principal llama a los subagentes como herramientas.',
      back: 'Sí: los resultados regresan al agente principal.',
      api: 'Patrón <i>Subagents</i>'
    }
  ],
  equiv: 'si N1 entregara la tarea completa y dejara de participar, el comportamiento correspondería al <a href="04_handoff.html">patrón 4, Handoff</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i> (Hierarchical task decomposition). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>langgraph-supervisor</i> (Multi-level hierarchies). <a href="https://github.com/langchain-ai/langgraph-supervisor-py" target="_blank" rel="noopener">github.com/langchain-ai/langgraph-supervisor-py</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>'
  ],
  toolNotes: {
    n1: {
      asistente_investigacion: 'ADK: <code>AgentTool(agent=research_assistant)</code>, igual que en el ejemplo oficial del patrón jerárquico. LangGraph: un supervisor que administra a otros supervisores.'
    },
    n2: {
      busqueda_interna: 'ADK: <code>AgentTool</code> en cada nivel. LangGraph: el supervisor de nivel intermedio con sus propios agentes.',
      resumidor: 'ADK: <code>AgentTool</code> en cada nivel. LangGraph: el supervisor de nivel intermedio con sus propios agentes.'
    }
  }
};
