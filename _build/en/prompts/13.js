window.PROMPTS = {
  gen: {
    prompt: `You are a Python programmer. Write a function that meets the goal you
receive, including the exact output format it specifies.

Deliver only the function code, without explanation.`,
    tools: []
  },
  cri: {
    prompt: `You are a Python code reviewer. You receive the original goal of the
function and its current version.

Instructions:
- Write improvement notes on efficiency, readability and correctness.
- Check that the function still meets the original goal, including the
  output format.
- Assign each note a severity: high, medium or low.
- Do not rewrite the code: only write the notes.`,
    tools: [],
    salida: 'High:   <note>\nMedium: <note>\nLow:    <note>',
    nota: 'the line "check that the function still meets the original goal" only works because the critic receives the goal. That is how it detects the type change in v2.'
  },
  ref: {
    prompt: `You are a Python programmer who improves existing code.

You receive the current version of a function and the reviewer's notes.
Rewrite the function addressing all the high and medium severity notes.

Deliver only the code, without explanation.`,
    tools: [],
    nota: 'this prompt does not mention the goal or ask to keep the output format. That is why, while optimizing, the refiner changed the return type: an implicit decision nobody asked for.'
  }
};
