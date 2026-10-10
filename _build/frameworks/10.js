window.FRAMEWORKS = {
  reviewed: '10 de octubre de 2026',
  demo: 'el manager asigna tareas con una herramienta (<code>asignar_tarea</code>), guarda el plan en un registro de tareas (<code>actualizar_registro</code>) y pide aprobación antes de una acción sobre producción (<code>solicitar_aprobacion</code>).',
  cols: ['Framework', 'Cómo coordina', 'Registro del plan y aprobación humana', 'API'],
  rows: [
    {
      fw: 'Microsoft Agent Framework',
      how: 'Orquestación Magentic, basada en Magentic-One de AutoGen. Un manager elige qué agente actúa en cada ronda. Si detecta que el equipo no avanza, reinicia y vuelve a planear.',
      back: 'Un <i>task ledger</i> con el plan y un <i>progress ledger</i> por ronda (¿se cumplió la solicitud?, ¿hay un ciclo?, ¿hay avance?, siguiente agente e instrucción). Revisión humana opcional del plan: aprobar o pedir cambios. Las herramientas sensibles pueden exigir aprobación.',
      api: '<code>MagenticBuilder</code> con <code>max_round_count</code>, <code>max_stall_count</code>, <code>max_reset_count</code> y <code>enable_plan_review</code> (Python, apagado por defecto) o <code>RequirePlanSignoff</code> (.NET, encendido por defecto).'
    },
    {
      fw: 'Google ADK',
      how: 'Sin una orquestación Magentic predefinida. Se arma con un coordinador que delega con <code>AgentTool</code> o <code>transfer_to_agent</code>.',
      back: 'El registro se guarda en el estado de la sesión. La aprobación se implementa con una herramienta que pausa la ejecución, o con un <code>SecurityPlugin</code> y un <code>PolicyEngine</code> que piden confirmación antes de ejecutar una herramienta (enfoque recomendado en TypeScript; en otros lenguajes está planeado).',
      api: '<code>AgentTool</code>, estado de sesión, <code>SecurityPlugin</code>'
    },
    {
      fw: 'LangGraph',
      how: 'Sin una orquestación Magentic predefinida. Se arma con un supervisor o un nodo de planeación que decide el siguiente agente.',
      back: 'El registro se guarda en el estado del grafo. La aprobación se hace con <code>interrupt()</code>, que pausa la ejecución y guarda el estado; se reanuda con <code>Command(resume=...)</code> (requiere un <i>checkpointer</i>).',
      api: 'Estado del grafo, <code>interrupt()</code>, <code>Command(resume=...)</code>'
    }
  ],
  equiv: 'Microsoft describe Magentic como la misma arquitectura que el <a href="14_group_chat.html">patrón 14, Group chat</a>, con un manager que planea. La aprobación de una acción puntual es el <a href="15_human_in_the_loop.html">patrón 15, Human-in-the-loop</a>.',
  sources: [
    'Microsoft. <i>Magentic orchestration</i>. Agent Framework. <a href="https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic" target="_blank" rel="noopener">learn.microsoft.com/.../orchestrations/magentic</a>',
    'Google. <i>Multi-agent patterns</i> (Human-in-the-loop). ADK Docs. <a href="https://github.com/google/adk-docs/blob/main/docs/workflows/patterns.md" target="_blank" rel="noopener">github.com/google/adk-docs/.../patterns.md</a>',
    'LangChain. <i>Interrupts</i>. LangGraph. <a href="https://docs.langchain.com/oss/python/langgraph/interrupts" target="_blank" rel="noopener">docs.langchain.com/oss/python/langgraph/interrupts</a>'
  ],
  toolNotes: {
    man: {
      asignar_tarea: 'Agent Framework: el manager Magentic elige al siguiente agente y su instrucción en el <i>progress ledger</i>. ADK: <code>AgentTool</code> o <code>transfer_to_agent</code>. LangGraph: un supervisor.',
      actualizar_registro: 'Agent Framework: <i>task ledger</i> y <i>progress ledger</i> integrados. ADK y LangGraph: el registro se guarda en el estado.',
      solicitar_aprobacion: 'Agent Framework: revisión del plan (<code>enable_plan_review</code>) o herramientas que exigen aprobación. ADK: una herramienta que pausa la ejecución, o <code>SecurityPlugin</code> con <code>PolicyEngine</code> (TypeScript). LangGraph: <code>interrupt()</code>.'
    }
  }
};
