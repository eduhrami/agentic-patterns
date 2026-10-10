window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el coordinador delega con una herramienta (<code>transferir_a_agente</code>) y el especialista le devuelve el control al terminar. Es el comportamiento de "agente como herramienta", y el demo lo usa igual en todos los patrones para que el flujo sea uniforme.',
  rows: [
    {
      fw: 'Google ADK (transferencia)',
      how: 'Al declarar <code>sub_agents</code>, ADK le da al coordinador la función <code>transfer_to_agent</code>. Su LLM la llama con el nombre del especialista, elegido a partir de las descripciones.',
      back: 'No, por defecto (modo <code>chat</code>): el especialista conserva el control hasta que transfiere de vuelta con otro <code>transfer_to_agent</code>.',
      api: '<code>sub_agents</code>, <code>transfer_to_agent</code>'
    },
    {
      fw: 'Google ADK 2.0 (modos de colaboración)',
      how: 'ADK genera una herramienta de delegación con el nombre de cada subagente.',
      back: 'Depende del modo: manual en <code>chat</code>, automático en <code>task</code> (vía <code>finish_task</code>) y en <code>single_turn</code> (con el resultado).',
      api: '<code>mode="task"</code>, <code>mode="single_turn"</code>'
    },
    {
      fw: 'Google ADK (agente como herramienta)',
      how: 'El especialista se envuelve como herramienta del coordinador.',
      back: 'Sí: su resultado regresa como respuesta de la herramienta.',
      api: '<code>AgentTool</code>'
    },
    {
      fw: 'LangChain (subagentes)',
      how: 'El agente principal llama a los subagentes como herramientas; todo el ruteo pasa por él.',
      back: 'Sí: los resultados regresan al agente principal.',
      api: 'Patrón <i>Subagents</i>'
    },
    {
      fw: 'LangGraph (supervisor)',
      how: 'Herramientas de handoff <code>transfer_to_&lt;agente&gt;</code> que devuelven <code>Command(goto=..., graph=Command.PARENT)</code>.',
      back: 'Sí: al terminar cada agente, el supervisor recibe el control y decide el siguiente paso.',
      api: '<code>langgraph-supervisor</code> (la librería ahora recomienda implementar el supervisor directamente con herramientas)'
    }
  ],
  equiv: 'si el especialista conserva el control y el coordinador ya no participa (como en la transferencia por defecto de ADK), el comportamiento corresponde al <a href="04_handoff.html">patrón 4, Handoff</a>.',
  sources: [
    'Google. <i>Multi-agent patterns</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'Google. <i>Build collaborative agent teams</i>. ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/collaboration.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../collaboration.md</a>',
    'LangChain. <i>Multi-agent</i>. <a href="https://docs.langchain.com/oss/python/langchain/multi-agent" target="_blank" rel="noopener">docs.langchain.com/oss/python/langchain/multi-agent</a>',
    'LangChain. <i>langgraph-supervisor</i>. <a href="https://pypi.org/project/langgraph-supervisor/" target="_blank" rel="noopener">pypi.org/project/langgraph-supervisor</a>'
  ],
  toolNotes: {
    coord: {
      transferir_a_agente: 'ADK: <code>transfer_to_agent</code> (sin regreso automático) o <code>AgentTool</code> (con regreso). LangChain/LangGraph: subagentes como herramientas o <code>transfer_to_&lt;agente&gt;</code> con supervisor.'
    }
  }
};
