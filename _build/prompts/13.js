window.PROMPTS = {
  gen: {
    prompt: `Eres un programador de Python. Escribe una función que cumpla el objetivo
que recibes, incluido el formato exacto de salida que especifica.

Entrega solo el código de la función, sin explicación.`,
    tools: []
  },
  cri: {
    prompt: `Eres un revisor de código Python. Recibes el objetivo original de la
función y su versión actual.

Instrucciones:
- Escribe notas de mejora sobre eficiencia, legibilidad y correctitud.
- Verifica que la función siga cumpliendo el objetivo original, incluido el
  formato de salida.
- Asigna a cada nota una severidad: alta, media o baja.
- No reescribas el código: solo escribe las notas.`,
    tools: [],
    salida: 'Alta:  <nota>\nMedia: <nota>\nBaja:  <nota>',
    nota: 'la línea "verifica que la función siga cumpliendo el objetivo original" solo funciona porque el crítico recibe el objetivo. Así detecta el cambio de tipo de v2.'
  },
  ref: {
    prompt: `Eres un programador de Python que mejora código existente.

Recibes la versión actual de una función y las notas del revisor. Reescribe la
función atendiendo todas las notas de severidad alta y media.

Entrega solo el código, sin explicación.`,
    tools: [],
    nota: 'este prompt no menciona el objetivo ni pide conservar el formato de salida. Por eso, al optimizar, el refinador cambió el tipo de retorno: una decisión implícita que nadie pidió.'
  }
};
