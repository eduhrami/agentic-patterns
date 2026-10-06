# Price agent: example traces

Oct 5, 2026 · @Eduardo Ramirez

## Introduction

In the following example we will look at the execution loop of an agent that reports the price of a product in the currency the user requests; in this case, in Mexican pesos. The agent has two tools, a search engine and a calculator, and receives system instructions that tell it which tools are available and in what format it must reply. In each iteration, the agent program sends the LLM a prompt with the goal and the accumulated observations, and the LLM replies with the next action to take. In the first iteration, the LLM decides to search for the product's price in dollars; in the second, with that price already in its observations, it searches for the day's exchange rate; in the third, it asks the calculator to multiply the price by the exchange rate; and in the fourth, having all the data, it declares the goal achieved and writes the final answer for the user.

The price and the exchange rate are illustrative values for the simulation.

## Trace 1: overview of the loop

This version shows only the LLM's decisions and the observations the tools return.

```text
GOAL: "How much does the Nintendo Switch 2 console cost in Mexican pesos?"
TOOLS: search engine, calculator
OBSERVATIONS: none

ITERATION 1
    The LLM analyzes the goal and the observations.
        Action:       use the search engine tool
        Input:        Nintendo Switch 2 price in dollars
    The search engine runs.
        Observation:  "Nintendo Switch 2: 449.99 USD at the official
                      United States store"
    Observations: ["Nintendo Switch 2: 449.99 USD"]
    Goal achieved? No. The loop repeats.

ITERATION 2
    The LLM analyzes the goal and the observations.
        Action:       use the search engine tool
        Input:        dollar to Mexican peso exchange rate today
    The search engine runs.
        Observation:  "1 USD = 18.40 MXN"
    Observations: ["Nintendo Switch 2: 449.99 USD", "1 USD = 18.40 MXN"]
    Goal achieved? No. The loop repeats.

ITERATION 3
    The LLM analyzes the goal and the observations.
        Action:       use the calculator tool
        Input:        449.99 × 18.40
    The calculator runs.
        Observation:  8279.816
    Observations: ["Nintendo Switch 2: 449.99 USD", "1 USD = 18.40 MXN",
                    8279.816]
    Goal achieved? No. The loop repeats.

ITERATION 4
    The LLM analyzes the goal and the observations.
        Action:       goal achieved
        Answer:       The Nintendo Switch 2 costs 449.99 dollars, which is
                      about 8,279.82 Mexican pesos at today's exchange rate
                      (18.40 pesos per dollar).
    Goal achieved? Yes. The loop ends.

FINAL ANSWER
    The Nintendo Switch 2 costs 449.99 dollars, which is about
    8,279.82 Mexican pesos at today's exchange rate.
```

## Trace 2: the loop with the intermediate prompts

This version shows, in each iteration, the exact prompt the LLM receives and the response it returns.

```text
SYSTEM INSTRUCTIONS (sent to the LLM in every iteration)
    You are an agent that reports the price of any product in the
    currency the user requests.
    To do so, search for the product's price; if it is in a currency
    other than the one requested, search for the exchange rate between
    both currencies and use the calculator to do the conversion.
    Available tools:
        - search engine: searches for information on the internet.
        - calculator: evaluates arithmetic operations.
    At each step reply with one of these two options:
        Action: <tool>               Input: <text for the tool>
        Action: goal achieved        Answer: <answer for the user>

GOAL: "How much does the Nintendo Switch 2 console cost in Mexican pesos?"
OBSERVATIONS: none

ITERATION 1
    Prompt to the LLM:
        Goal: How much does the Nintendo Switch 2 console cost in Mexican pesos?
        Observations: none
        What is your next action?
    LLM response:
        Action:       search engine
        Input:        Nintendo Switch 2 price in dollars
    The search engine runs.
        Observation:  "Nintendo Switch 2: 449.99 USD at the official
                      United States store"
    Goal achieved? No. The loop repeats.

ITERATION 2
    Prompt to the LLM:
        Goal: How much does the Nintendo Switch 2 console cost in Mexican pesos?
        Observations:
            1. Nintendo Switch 2: 449.99 USD at the official United States store
        What is your next action?
    LLM response:
        Action:       search engine
        Input:        dollar to Mexican peso exchange rate today
    The search engine runs.
        Observation:  "1 USD = 18.40 MXN"
    Goal achieved? No. The loop repeats.

ITERATION 3
    Prompt to the LLM:
        Goal: How much does the Nintendo Switch 2 console cost in Mexican pesos?
        Observations:
            1. Nintendo Switch 2: 449.99 USD at the official United States store
            2. 1 USD = 18.40 MXN
        What is your next action?
    LLM response:
        Action:       calculator
        Input:        449.99 × 18.40
    The calculator runs.
        Observation:  8279.816
    Goal achieved? No. The loop repeats.

ITERATION 4
    Prompt to the LLM:
        Goal: How much does the Nintendo Switch 2 console cost in Mexican pesos?
        Observations:
            1. Nintendo Switch 2: 449.99 USD at the official United States store
            2. 1 USD = 18.40 MXN
            3. 8279.816
        What is your next action?
    LLM response:
        Action:       goal achieved
        Answer:       The Nintendo Switch 2 costs 449.99 dollars, which is
                      about 8,279.82 Mexican pesos at today's exchange rate
                      (18.40 pesos per dollar).
    Goal achieved? Yes. The loop ends.

FINAL ANSWER
    The Nintendo Switch 2 costs 449.99 dollars, which is about
    8,279.82 Mexican pesos at today's exchange rate.
```

## What to notice in the traces

- **The same tool, two purposes.** The agent uses the search engine twice: first for the price and then for the exchange rate.
- **The system instructions do not change.** They tell the LLM which tools it has and in what format to reply, so the program can read its response and run the indicated tool.
- **The prompt grows with each iteration.** The list of observations is the only thing the LLM "remembers" from the previous steps.
- **The LLM never executes anything.** It only replies with text; the agent program reads "Action: calculator", calls the tool and adds the result to the next prompt.
- **The LLM also contributes judgment.** It rounds the calculator's result to two decimals to present it as an amount in pesos.
