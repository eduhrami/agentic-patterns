# Function Calling vs. ReAct: example traces

Oct 5, 2026 · @Eduardo Ramirez

## When to use each strategy

For example, in a customer service assistant with structured queries, such as the status of an order or the cancellation of a subscription, FC is the most suitable option: the agent recognizes the user's intent, calls the CRM function and returns the result. On the other hand, if that same assistant must handle open-ended complaints, where it needs to analyze the problem, determine the cause and consult several sources, ReAct allows for a better reasoning process.

## Example 1: Function Calling (order status)

In the first example, a user asks where their order is. Since it is a structured query, the assistant uses FC: along with the message, the LLM receives the definitions of the available functions, each with its name, its parameters and a short description. The LLM recognizes that the user's intent corresponds to `get_order`, extracts the order number from the message and returns the call in JSON format. The program executes that function in the CRM and hands the result to the LLM, which turns it into a clear answer for the user. Everything happens in a single step and without visible intermediate reasoning.

```text
AVAILABLE FUNCTIONS (sent to the LLM along with the message)
    get_order(order_id: text)
        Returns the status, the carrier and the estimated delivery date.
    cancel_subscription(customer_id: text)
        Cancels the customer's active subscription.

USER MESSAGE
    "Hi, can you tell me where my order 48213 is?"

STEP 1: THE LLM IDENTIFIES THE INTENT AND CHOOSES THE FUNCTION
    Function call:
        {
          "name": "get_order",
          "arguments": { "order_id": "48213" }
        }

STEP 2: THE PROGRAM EXECUTES THE FUNCTION IN THE CRM
    Result:
        {
          "status": "in transit",
          "carrier": "Envíos del Norte",
          "estimated_delivery": "2026-09-25"
        }

STEP 3: THE LLM WRITES THE ANSWER
    Final answer:
        Your order 48213 is on its way with Envíos del Norte and the
        estimated delivery is Friday, September 25.
```

## Example 2: ReAct (duplicate charge complaint)

In the second example, a user complains that they were charged twice for their subscription. Here it is not enough to call a function: the assistant has to confirm the problem, find out the cause and decide which solution applies, so it uses ReAct. In each iteration, the LLM writes a thought in which it reasons about what it knows so far, chooses an action and receives an observation that guides the next step. So it first reviews the customer's payments, then their account history, then queries the knowledge base to find out whether it is a known error and, finally, requests the refund before replying with the cause of the problem and the solution.

```text
AVAILABLE TOOLS
    get_payments(customer_id, month)
    get_account_history(customer_id)
    search_knowledge_base(query)
    request_refund(payment_id, amount, reason)

USER MESSAGE (customer C-1027)
    "I was charged twice for the subscription this month. This is unacceptable,
    I want a solution."

ITERATION 1
    Thought:      The customer reports a double charge. First I check their
                  September payments to confirm it.
    Action:       get_payments(customer_id = "C-1027", month = "September 2026")
    Observation:  P-88310   Sep 1   $199 MXN   Premium Subscription   card ...4411
                  P-88342   Sep 3   $199 MXN   Premium Subscription   card ...8830

ITERATION 2
    Thought:      There are two charges for the same period, with different
                  cards. I review the account history to understand why.
    Action:       get_account_history(customer_id = "C-1027")
    Observation:  Sep 2: the customer changed their payment method to card ...8830
                  Sep 3: the system charged the subscription with the new method

ITERATION 3
    Thought:      When the card was changed, the system seems to have charged
                  an already paid period again. I check whether it is a known
                  error and what the policy says.
    Action:       search_knowledge_base("duplicate charge when changing payment method")
    Observation:  "Known error #312: when the payment method is updated, the
                  system may charge the current period again. A full refund of
                  the second charge applies; it is reflected within 5 to 10
                  business days."

ITERATION 4
    Thought:      The case matches error #312. The second charge should be
                  refunded.
    Action:       request_refund(payment_id = "P-88342", amount = 199,
                                 reason = "Duplicate charge, error #312")
    Observation:  "Refund R-5521 created. It will be reflected within 5 to 10 business days."

ITERATION 5
    Thought:      I confirmed the problem, identified the cause and created the
                  refund. I can reply to the customer.
    Final answer:
        You're right, you were charged twice for the September subscription.
        It happened because of an error in our system when you updated your
        payment method on September 2. We have already created the refund for
        the second charge ($199 MXN, reference R-5521), which you will see
        within 5 to 10 business days. We apologize for the inconvenience.
```

## Key differences

FC solves in a single step what is already structured; ReAct chains several steps when the agent has to figure out what to do.

| Aspect | Function Calling | ReAct |
| --- | --- | --- |
| Steps | One: the intent translates directly into a call | Several: the agent does not know in advance how many queries it will need |
| Reasoning | Implicit, not shown | Explicit: a *Thought* before each action |
| Action format | JSON with arguments defined by a schema, easy to validate | Action chosen after reasoning about the previous observations |
| Role of the observations | The result is used to write the answer | Each observation changes the next step (two different cards lead to reviewing the history) |
| Ideal case | Structured queries: order status, cancellation | Open-ended complaints: analyze, find the cause, consult several sources |

In practice they are not mutually exclusive: many ReAct agents use function calling as the mechanism to invoke their tools; what sets ReAct apart is the explicit reasoning loop around those calls.
