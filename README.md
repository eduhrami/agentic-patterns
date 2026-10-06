# Demos de agentes y orquestación

Demos interactivos para entender, paso a paso, cómo funciona un agente LLM por dentro y cómo se coordinan varios agentes en los patrones de orquestación más comunes.

**Úsalos en línea:** [https://eduhrami.github.io/demos-agentes/](https://eduhrami.github.io/demos-agentes/)

Disponibles en español y en inglés. En el índice se elige el idioma, y cada demo tiene un botón para cambiar a su versión en el otro idioma.

> **English version:** [https://eduhrami.github.io/demos-agentes/en/](https://eduhrami.github.io/demos-agentes/en/). Interactive demos that show, step by step, how an LLM agent works on the inside and how several agents coordinate in 16 orchestration patterns. Traces, system prompts and the interface are fully translated.

Autor: **Eduardo H. Ramirez, PhD** · [LinkedIn](https://www.linkedin.com/in/ehramirez) · [X](https://x.com/eduhrami) · [GitHub](https://github.com/eduhrami)

## Qué contiene

### 1. Anatomía de un agente

[Abrir el demo](https://eduhrami.github.io/demos-agentes/anatomia_agentes.html)

Muestra, con animaciones, qué parte del proceso responde el modelo, qué invocación realiza el harness (el programa del agente), cómo regresan las observaciones de las herramientas y cómo crece el prompt en cada iteración. Incluye tres casos:

| Caso | Qué ilustra |
| --- | --- |
| [Agente de precios](https://eduhrami.github.io/demos-agentes/anatomia_agentes.html#precios) | El ciclo básico de acción y observación con un motor de búsqueda y una calculadora |
| [Function Calling](https://eduhrami.github.io/demos-agentes/anatomia_agentes.html#fc) | El modelo devuelve una llamada a función en JSON y el programa la ejecuta |
| [ReAct](https://eduhrami.github.io/demos-agentes/anatomia_agentes.html#react) | Pensamiento, acción y observación en cinco iteraciones |

### 2. Patrones de orquestación multi-agente

Dieciséis demos a nivel workflow. Cada uno muestra qué contexto recibe cada agente, qué escribe en el estado compartido, quién decide el siguiente paso y dónde intervienen el código y las personas. Cada agente tiene un chip **system prompt**: al pasar el cursor o hacer clic se muestran sus instrucciones y las herramientas que puede invocar.

| # | Patrón | Escenario | Fuente del ejemplo |
| --- | --- | --- | --- |
| 1 | [Secuencial](https://eduhrami.github.io/demos-agentes/patrones/01_secuencial.html) | Generación de un contrato | Microsoft |
| 2 | [Routing por clasificación](https://eduhrami.github.io/demos-agentes/patrones/02_routing.html) | Mensajes de servicio al cliente | Anthropic |
| 3 | [Coordinator/dispatcher](https://eduhrami.github.io/demos-agentes/patrones/03_coordinator_dispatcher.html) | Cargo no reconocido y falla del módem | Google ADK |
| 4 | [Handoff](https://eduhrami.github.io/demos-agentes/patrones/04_handoff.html) | Internet sin servicio y bonificación | Microsoft |
| 5 | [Sectioning y fan-out/gather](https://eduhrami.github.io/demos-agentes/patrones/05_fan_out_gather.html) | Revisión de un pull request | Google ADK |
| 6 | [Voting](https://eduhrami.github.io/demos-agentes/patrones/06_voting.html) | Detección de vulnerabilidades | Anthropic |
| 7 | [Selección dinámica y agregación](https://eduhrami.github.io/demos-agentes/patrones/07_seleccion_dinamica.html) | Análisis de una acción ficticia | Microsoft |
| 8 | [Orchestrator-workers](https://eduhrami.github.io/demos-agentes/patrones/08_orchestrator_workers.html) | Incidentes de soporte por región | Anthropic |
| 9 | [Hierarchical decomposition](https://eduhrami.github.io/demos-agentes/patrones/09_hierarchical.html) | Reporte trimestral de satisfacción | Google ADK |
| 10 | [Magentic](https://eduhrami.github.io/demos-agentes/patrones/10_magentic.html) | Respuesta a un incidente de SRE | Microsoft |
| 11 | [Evaluator-optimizer y maker-checker](https://eduhrami.github.io/demos-agentes/patrones/11_evaluator_optimizer.html) | Traducción literaria | Anthropic |
| 12 | [Generator-critic](https://eduhrami.github.io/demos-agentes/patrones/12_generator_critic.html) | Validación de una consulta SQL | Google ADK |
| 13 | [Iterative refinement](https://eduhrami.github.io/demos-agentes/patrones/13_iterative_refinement.html) | Optimización de una función | Google ADK |
| 14 | [Group chat](https://eduhrami.github.io/demos-agentes/patrones/14_group_chat.html) | Evaluación de un parque | Microsoft |
| 15 | [Human-in-the-loop](https://eduhrami.github.io/demos-agentes/patrones/15_human_in_the_loop.html) | Reembolso por cobro duplicado | Google ADK y Microsoft |
| 16 | [Patrones compuestos](https://eduhrami.github.io/demos-agentes/patrones/16_compuestos.html) | Falla de sincronización de una app | Google ADK |

Los nombres de personas, empresas, folios y cifras son ficticios. Los system prompts son hipotéticos: están redactados para ilustrar el rol de cada agente y no forman parte de los traces originales.

## Cómo usar los demos

- **Avanzar:** botones Anterior y Siguiente, o las flechas del teclado.
- **Reproducción automática:** botón Reproducir o barra espaciadora, con tres velocidades.
- **Saltar a un paso:** haz clic en la línea de tiempo bajo los controles.
- **Panel derecho:** alterna entre el estado compartido (o el prompt que recibe el modelo, en la anatomía) y el trace original, que se revela conforme avanzas.
- **Tema:** botón para alternar entre claro y oscuro.

Las páginas no tienen dependencias externas. También funcionan sin conexión: descarga el repositorio y abre `index.html` en el navegador.

## Estructura del repositorio

```
index.html                 Índice en español
anatomia_agentes.html      Demo de anatomía de un agente (español)
patrones/                  Los 16 demos de patrones en español (generados)
*.md                       Traces fuente en español
en/
    index.html             Índice en inglés
    agent_anatomy.html     Demo de anatomía en inglés
    patterns/              Los 16 demos de patrones en inglés (generados)
    *.md                   Traces fuente traducidos al inglés
_build/                    Motor, datos de cada patrón, system prompts y scripts
    en/                    Datos y system prompts en inglés
```

Para regenerar y validar los demos de patrones (ambos idiomas) después de editar los traces o los datos:

```
python3 _build/construir.py
python3 _build/verificar.py      # requiere: pip install playwright && playwright install chromium
```

Los detalles de los formatos de datos y las reglas de edición están en [CLAUDE.md](CLAUDE.md).

## Referencias

Anthropic. (2024, 19 de diciembre). *Building effective agents*. https://www.anthropic.com/engineering/building-effective-agents

Cognition. (2025, 12 de junio). *Don't build multi-agents* (W. Yan). https://cognition.com/blog/dont-build-multi-agents

Google. (2025, 16 de diciembre). *Developer's guide to multi-agent patterns in ADK* (S. Saboo). Google Developers Blog. https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/

Microsoft. (2026, 12 de febrero). *AI agent orchestration patterns* (C. Kittel y C. Siemens). Azure Architecture Center. https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns

Yan, W. (2026, 22 de abril). *Multi-agents: What's actually working* [Publicación en X]. https://x.com/walden_yan/status/2047054554433462360
