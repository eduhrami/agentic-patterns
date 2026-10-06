# Example traces of orchestration patterns

**Prompt Engineering and Agents Course** · Eduardo Ramirez · October 5, 2026

This document presents a simulated trace for each orchestration pattern in the document *Multi-agent orchestration patterns*. Each scenario follows the example given by the source of the pattern (Anthropic, Microsoft or Google ADK). The names of people, companies, reference numbers and figures are fictitious.

Each trace is followed by a **reading** with three points: who decides what, what the trace shows about the pattern, and how the Cognition (2025) counterpoint applies.

## Notation conventions

| Label | Meaning |
| --- | --- |
| `PATTERN` | Pattern illustrated by the trace |
| `AGENTS` | Participating agents, with their tools or their function |
| `SHARED STATE` | Keys where the agents write their results |
| `STEP`, `TURN`, `ITERATION`, `ROUND` | Unit of progress, depending on the pattern |
| `Receives` | Context that enters the agent at that step |
| `Action` / `Observation` | Call to a tool and its result |
| `GATE` | Programmatic check between steps |
| `HANDOFF` | Transfer of full control to another agent |
| `PAUSE` / `RESUME` | Human approval point |

## Index

| Section | Pattern | Scenario | Example source |
| --- | --- | --- | --- |
| 1 | Sequential | Drafting a contract | Microsoft |
| 2 | Routing by classification | Customer service messages | Anthropic |
| 3 | Coordinator/dispatcher | Unrecognized charge and modem failure | Google ADK |
| 4 | Handoff | Internet outage and service credit | Microsoft |
| 5 | Sectioning and fan-out/gather | Reviewing a pull request | Google ADK |
| 6 | Voting | Vulnerability detection | Anthropic |
| 7 | Dynamic selection and aggregation | Analysis of a fictitious stock | Microsoft |
| 8 | Orchestrator-workers | Support incidents by region | Anthropic |
| 9 | Hierarchical decomposition | Quarterly satisfaction report | Google ADK |
| 10 | Magentic | Responding to an SRE incident | Microsoft |
| 11 | Evaluator-optimizer and maker-checker | Literary translation | Anthropic |
| 12 | Generator-critic | Validating a SQL query | Google ADK |
| 13 | Iterative refinement | Optimizing a function | Google ADK |
| 14 | Group chat | Evaluating a park | Microsoft |
| 15 | Human-in-the-loop | Refund for a duplicate charge | Google ADK and Microsoft |
| 16 | Composite patterns | App sync failure | Google ADK |

---

## 1. Sequential pattern

A law firm drafts contracts with four agents in a fixed order. Between the second and third steps, a programmatic check verifies that the draft includes all the negotiated terms before continuing.

```text
PATTERN      Sequential (the design defines the order)
AGENTS
    A1 template_selector      tools: template_library
    A2 clause_customizer      tools: none (fine-tuned model)
    A3 compliance_reviewer    tools: regulatory_db
    A4 risk_assessor          tools: liability_db, save_document
SHARED STATE
    request · template · draft · compliance_findings · risk_assessment

INPUT
    Consulting services agreement
    Parties: Consultora Delta, S.A. de C.V. (provider) and Industrias Ríos, S.A. de C.V. (client)
    Jurisdiction: Monterrey, Nuevo León
    Negotiated terms: $480,000 MXN plus VAT · 3 installments ·
                      liability cap equal to the contract amount · 6-month term

STEP 1 · A1 template_selector
    Receives:    request
    Action:      find_template(type = "professional services", jurisdiction = "Nuevo León")
    Observation: template PSP-NL-07, version 2026-03
    Writes:      template

STEP 2 · A2 clause_customizer
    Receives:    request + template
    Output:      draft v1
                 Third clause (payment): 3 installments of $160,000 MXN plus VAT
                 Eighth clause (liability): cap of $480,000 MXN
                 Tenth clause (term): 6 months from signature
    Writes:      draft

GATE 1 · programmatic check
    Rule:        every negotiated term appears in the draft
    Result:      amount ✔ · installments ✔ · liability cap ✔ · term ✔
    Decision:    continue to step 3

STEP 3 · A3 compliance_reviewer
    Receives:    request + draft v1
    Action:      query_regulatory_db(topics = ["personal data", "invoicing"])
    Observation: 1. The service gives access to the client's employee data and the template
                    lacks a personal data processing clause.
                 2. The draft omits that each installment requires a tax invoice (CFDI).
    Output:      draft v2 with the fourteenth and fifteenth clauses
    Writes:      compliance_findings, draft

STEP 4 · A4 risk_assessor
    Receives:    request + draft v2 + compliance_findings
    Action:      query_liability_db(type = "consulting", amount = 480000)
    Observation: medium risk rating
                 The early termination clause does not define a penalty.
    Output:      recommendation: add a penalty equal to one installment
    Action:      save_document("PSP-NL-07_Delta-Rios_v2.docx")
    Writes:      risk_assessment

RESULT
    Proposed contract v2 with two compliance findings addressed and one risk
    recommendation pending a decision by the responsible attorney.
```

**Reading the trace**

- **Who decides:** the design fixed the order of the four agents. No agent chose the next one.
- **What it shows:** if the gate had found a missing term, the chain would have stopped before the compliance review, instead of propagating an incomplete draft.
- **Counterpoint (Cognition):** A3 and A4 receive the original request in addition to the draft. If A4 received only draft v2, it would not know that the liability cap was negotiated and might recommend changing it.

---

## 2. Routing by classification

A classifier with structured output sends each customer service message to a specialized branch. Each branch has its own prompt, tools and model. A code rule handles low-confidence cases.

```text
PATTERN      Routing by classification
CLASSIFIER   small model with structured output
             categories: general_inquiry | refund | tech_support
BRANCHES
    general_inquiry   FAQ prompt · knowledge base · small model
    refund            policy prompt · get_payments, request_refund · medium model
    tech_support      diagnostic prompt · get_device, search_incidents · large model
CODE RULE
    confidence < 0.70 → general_inquiry with the instruction to ask for more detail

MESSAGE 1 (customer C-2210)
    "What time are you open until on Saturdays?"
    Classifier → {"category": "general_inquiry", "confidence": 0.97}
    Route      → general_inquiry
    Response   "On Saturdays we are open from 9:00 to 14:00."

MESSAGE 2 (customer C-1388)
    "I canceled my annual plan after 10 days and I haven't gotten anything back."
    Classifier → {"category": "refund", "confidence": 0.93}
    Route      → refund
    Receives   the full original message and the customer id
    Action:      get_payments(customer_id = "C-1388")
    Observation: annual payment of $2,388 MXN on Sep 4 · cancellation on Sep 14
    Action:      request_refund(payment_id = "P-90215", amount = 2388,
                                reason = "Cancellation within 30 days")
    Observation: refund R-6120 created
    Response   "Your cancellation happened within the first 30 days, so a full
               refund of $2,388 MXN applies (reference R-6120)."

MESSAGE 3 (customer C-0457)
    "After updating the app, the code scanner won't open the camera."
    Classifier → {"category": "tech_support", "confidence": 0.88}
    Route      → tech_support (large model)

MESSAGE 4 (customer C-3301)
    "I want to know if you can refund me or if the problem is with the app."
    Classifier → {"category": "refund", "confidence": 0.52}
    Rule       confidence 0.52 < 0.70 → general_inquiry
    Response   "Happy to help. Can you tell me what happened with the app and which
               purchase you'd like us to review?"
```

**Reading the trace**

- **Who decides:** the classifier makes a single decision per message; the low-confidence rule is decided by code.
- **What it shows:** each branch uses the model it needs. Simple questions go to the small model and diagnoses to the large one.
- **Counterpoint (Cognition):** the refund branch receives the original message, without the classifier's rewording. That way it keeps details such as "after 10 days", which determine the applicable policy.

---

## 3. Coordinator/dispatcher

A coordinator agent reads the descriptions of two specialists and decides who to send each part of the request to. The customer's message contains two problems, and the coordinator handles them one after the other.

```text
PATTERN      Coordinator/dispatcher
COORDINATOR  coordinator_agent (LLM)
SPECIALISTS (descriptions read by the coordinator)
    billing        "Clarifies charges, invoices and payments. Can adjust charges."
    tech_support   "Diagnoses equipment and connection failures. Can update
                    the modem and schedule technician visits."

USER MESSAGE (customer C-5072)
    "My September bill has a $350 charge for a 'technician visit' I never
    requested, and on top of that the modem restarts by itself several times a day."

TURN 1 · coordinator
    Analysis:    the message has two requests: an unrecognized charge and an equipment failure.
    Decision:    handle the charge first, because it may depend on the visit history.
    Transfers to billing
    Context:     full conversation

TURN 2 · billing
    Action:      get_charges(customer_id = "C-5072", month = "September 2026")
    Observation: charge VT-8812 · $350 · visit on Sep 12 · status: canceled by the customer
    Action:      adjust_charge(charge_id = "VT-8812", reason = "canceled visit")
    Observation: credit note NC-3390 for $350 applied to the October bill
    Returns control to the coordinator

TURN 3 · coordinator
    Decision:    the first request is resolved; transfers the second one.
    Transfers to tech_support
    Context:     full conversation + billing result

TURN 4 · tech_support
    Action:      get_device(customer_id = "C-5072")
    Observation: 14 restarts in 72 hours · firmware 3.1.2 · current version 3.4.0
    Action:      update_firmware(device_id = "MDM-55102", version = "3.4.0")
    Observation: update scheduled for 02:00
    Returns control to the coordinator

FINAL RESPONSE (coordinator)
    We reviewed both issues. The $350 charge was for a visit you
    canceled; we already applied a credit note for that amount to your October
    bill (reference NC-3390). The restarts are caused by outdated firmware;
    your modem will be updated tonight at 2:00. If the restarts continue,
    we can schedule a visit at no cost.
```

**Reading the trace**

- **Who decides:** the coordinator chooses the specialist based on their descriptions and decides the order of attention.
- **What it shows:** the coordinator stays in the conversation after each transfer and writes the final response.
- **Counterpoint (Cognition):** if the coordinator had sent both parts in parallel, tech support could have scheduled a paid visit while billing was canceling the charge for another visit. Handling them in sequence, with the full conversation and the billing result, avoids those conflicting decisions.

---

## 4. Handoff

A telecommunications support portal uses handoff between specialists. Each agent decides whether to resolve or to transfer full control. The finance agent has a credit limit, and the case ends with a person.

```text
PATTERN      Handoff (one active agent at a time)
AGENTS
    triage         handles common problems; transfers the rest
    network_tech   diagnoses network and coverage failures
    finance        credits and adjustments; limit of $100 MXN per case
    human          human support advisor
LIMIT          5 transfers per conversation

USER MESSAGE (customer C-7740)
    "I've been without internet for three days. I already restarted everything. I want a discount for those days."

ACTIVE AGENT · triage
    Thought:     the customer already restarted the equipment; the problem exceeds the basic guide.
    HANDOFF → network_tech       transfers: 1 of 5
    Context transferred: full trace (message and triage steps)

ACTIVE AGENT · network_tech
    Action:      get_node_status(customer_id = "C-7740")
    Observation: node MTY-NORTE-14 with a fiber cut since Oct 2; repaired on Oct 5 at 16:40
    Action:      check_connection(customer_id = "C-7740")
    Observation: connection restored at 300 Mbps
    Thought:     the technical failure is resolved; the credit belongs to finance.
    HANDOFF → finance            transfers: 2 of 5
    Context transferred: full trace + node diagnosis

ACTIVE AGENT · finance
    Action:      calculate_credit(monthly_fee = 1200, days_without_service = 3)
    Observation: credit of $120 MXN (1,200 / 30 × 3)
    Thought:     $120 exceeds my limit of $100 per case.
    HANDOFF → human              transfers: 3 of 5
    Context transferred: full trace + calculated credit

ACTIVE AGENT · human (advisor Luis M.)
    Reviews the trace: fiber cut confirmed, service restored, $120 credit calculated.
    Action:      apply_credit(customer_id = "C-7740", amount = 120)
    Response   "We confirmed a fiber cut in your area from October 2 to 5.
               Service has been restored and we applied a credit of
               $120 MXN to your next bill."
```

**Reading the trace**

- **Who decides:** each active agent decides whether to resolve or transfer. At the start, nobody knew the case would end in finance and then with a person.
- **What it shows:** the transfer counter protects against infinite loops, the main risk Microsoft points out for this pattern.
- **Counterpoint (Cognition):** each transfer includes the full trace. That is why the person approves without asking the customer again how many days they were without service. Since there is only one active agent, there are no simultaneous conflicting decisions.

---

## 5. Sectioning and fan-out/gather

Three agents review the same pull request at the same time, each from a different angle, and write to separate keys of the state. A synthesizer combines the three reports into a single comment.

```text
PATTERN      Parallel fan-out/gather (sectioning)
INPUT        Pull request #418 "Add customer search endpoint"
             api/customers.py (+64 −3) · db/queries.py (+22 −0)
FAN-OUT      in parallel, each agent writes to its own key
    security_auditor       → security_report
    style_reviewer         → style_report
    performance_analyst    → performance_report

[t = 0 s]   The three agents start with the same diff

[t = 9 s]   style_reviewer finishes
    style_report: 2 findings
      - api/customers.py:41 · the variable `x` needs a descriptive name
      - db/queries.py:12 · line of 104 characters (limit: 100)

[t = 13 s]  security_auditor finishes
    security_report: 1 critical finding
      - db/queries.py:18 · the `name` parameter is concatenated into the SQL (injection risk)

[t = 16 s]  performance_analyst finishes
    performance_report: 1 finding
      - db/queries.py:18 · LIKE '%text%' search on customers (1.2 M rows) without an index

GATHER · synthesizer
    Receives: diff + security_report + style_report + performance_report
    Output:   single comment on the PR, ordered by severity
      1. Blocking · db/queries.py:18
         Use a parameterized query. While fixing it, consider switching the search
         to a full-text index (also flagged by performance).
      2. Minor · db/queries.py:12 · split the 104-character line.
      3. Minor · api/customers.py:41 · rename `x` to `search_filter`.
      Suggested status: changes requested

TOTAL TIME     16 s in parallel (in sequence: 9 + 13 + 16 = 38 s)
```

**Reading the trace**

- **Who decides:** the design defined the three reviewers; the synthesizer decides the severity order.
- **What it shows:** the total time equals that of the slowest agent. Two reports flagged the same line, and the synthesizer merged them into a single point.
- **Counterpoint (Cognition):** the risk is low because the three agents analyze the same input and only report. If each agent had modified the code to fix its finding, the fixes to line 18 could have collided.

---

## 6. Voting

Three different prompts review the same code fragment looking for vulnerabilities. The voting rule determines whether the fragment is flagged. The trace compares two fragments under three rules.

```text
PATTERN      Voting
TASK         Does the fragment contain a vulnerability?
VOTERS       different prompts over the same input
    V1  focus: SQL and command injection
    V2  focus: exposed credentials and secrets
    V3  focus: input validation and permissions
ACTIVE RULE  "any": a single positive vote is enough

FRAGMENT F-27
    def export_report(user, path):
        os.system("zip /tmp/report.zip " + path)
        return "/tmp/report.zip"

    V1 → {"vulnerable": true,  "reason": "path is concatenated into a system command"}
    V2 → {"vulnerable": false}
    V3 → {"vulnerable": true,  "reason": "it does not check that the user has permission on the path"}
    Count:    2 of 3
    Decision: FLAGGED

FRAGMENT F-28
    def connect():
        logger.info("Connecting to %s", os.environ["DB_URL"])
        return psycopg.connect(os.environ["DB_URL"])

    V1 → {"vulnerable": false}
    V2 → {"vulnerable": true,  "reason": "DB_URL includes the password and is written to the log"}
    V3 → {"vulnerable": false}
    Count:    1 of 3
    Decision: FLAGGED

EFFECT OF THE RULE
    Fragment    Votes   Any          Majority (≥ 2)  Unanimity
    F-27        2 of 3  flagged      flagged         not flagged
    F-28        1 of 3  flagged      not flagged     not flagged
```

**Reading the trace**

- **Who decides:** the voting rule, defined in the design. The voters only issue judgments.
- **What it shows:** only one voter, the one specialized in secrets, detected the problem in F-28. "Any" flags it; "majority" would have let it through. It is the right rule when a false negative costs more than reviewing a false positive. "Unanimity" would also have let F-27 through.
- **Counterpoint (Cognition):** the voters issue independent judgments on the same object and the rule only counts them, so there are no implicit decisions to combine. The cost is economic: three calls per fragment.

---

## 7. Dynamic selection and weighted aggregation

An orchestrator chooses which analysts to invoke based on the request and combines their scores with a formula, without using an LLM to synthesize. The company is fictitious and the example is for teaching purposes; it is not an investment recommendation.

```text
PATTERN      Concurrent with dynamic selection and weighted aggregation
REGISTERED AGENTS
    fundamental   financial statements and competitive position
    technical     price, volume and momentum
    sentiment     news and social media
    esg           environmental, social and corporate governance reports

REQUEST
    "With a two-week horizon, should we hold the position in GRPX
    (fictitious company) ahead of its quarterly report?"

DYNAMIC SELECTION · orchestrator
    Thought:     the horizon is two weeks; ESG analysis contributes to long horizons.
    Invokes:     fundamental, technical, sentiment
    Skips:       esg

PARALLEL EXECUTION (score from −2 to +2)
    fundamental → +1   stable margins and low debt
                       (internally consults two sub-agents: financial_statements and competition)
    technical   → −1   the price trades below its 50-day average
    sentiment   →  0   mixed news ahead of the report

AGGREGATION (code)
    Weights:   fundamental 0.4 · technical 0.3 · sentiment 0.3
    Score:     0.4 × (+1) + 0.3 × (−1) + 0.3 × (0) = +0.1
    Rule:      > +0.5 increase · from −0.5 to +0.5 hold · < −0.5 reduce
    Result:    HOLD

OUTPUT
    Recommendation: hold the position. The three analyses are attached with their
    scores for review by the portfolio manager.
```

**Reading the trace**

- **Who decides:** the orchestrator decides which agents to invoke; the formula, defined in the design, decides the result.
- **What it shows:** the two decisions of Microsoft's concurrent pattern: dynamic selection (ESG was skipped) and an aggregation strategy (weighted combination). The fundamental agent uses its own internal orchestration.
- **Counterpoint (Cognition):** aggregating with a formula avoids the step in which an LLM synthesizer combines different interpretations. If a narrative were required, the synthesizer would need the full analyses, not just the scores.

---

## 8. Orchestrator-workers

The orchestrator first checks how many regions have incidents and creates one worker per region. The workers only query data and return structured results; the orchestrator writes the conclusions.

```text
PATTERN      Orchestrator-workers
REQUEST      "Summarize the third-quarter support incidents by region and
             point out the most frequent cause in each one."

ORCHESTRATOR · planning
    Action:      list_regions_with_incidents(quarter = "2026-Q3")
    Observation: North, Central, West, Southeast
    Decision:    create 4 workers, one per region, with the same scoped instruction:
                 "Query the incidents of region R in 2026-Q3. Return the total,
                 the top 3 causes with their counts and one example ticket.
                 Do not write conclusions."

WORKERS (in parallel, read-only)
    W1 North      total 412 · fiber 168 · modem config. 97 · billing 61 · e.g. T-30418
    W2 Central    total 655 · modem config. 240 · fiber 151 · billing 118 · e.g. T-31902
    W3 West       total 298 · modem config. 121 · billing 74 · fiber 52 · e.g. T-30777
    W4 Southeast  total 187 · fiber 89 · billing 41 · modem config. 30 · e.g. T-32050

SYNTHESIS · orchestrator
    Quarter total: 412 + 655 + 298 + 187 = 1,552 incidents
    Most frequent cause by region:
        North      fiber failures            168 of 412  (41%)
        Central    modem configuration       240 of 655  (37%)
        West       modem configuration       121 of 298  (41%)
        Southeast  fiber failures             89 of 187  (48%)
    Cross-cutting observation: modem configuration is the main cause in two of
    four regions (Central and West), which suggests reviewing the installation guide.

RESULT       executive summary with the table above and the four example tickets
```

**Reading the trace**

- **Who decides:** the orchestrator decides how many workers to create after querying the data. In the fourth quarter there could be five regions.
- **What it shows:** the difference from parallelization: here the subtasks are defined during execution, not in the design.
- **Counterpoint (Cognition):** the workers investigate and the orchestrator keeps the decisions and the conclusions, the design Cognition considers viable. If each worker had written its own section of the summary, the orchestrator would receive four styles and four different criteria for "main cause".

---

## 9. Hierarchical decomposition

A writer agent drafts a report and delegates a scoped question to a research assistant. The assistant in turn coordinates a search agent and a summarizing agent. The writer waits for the result and continues its own reasoning.

```text
PATTERN      Hierarchical decomposition
LEVELS
    L1 report_writer          tool: research_assistant (sub-agent as a tool)
    L2 research_assistant     tools: internal_search, summarizer (sub-agents)
    L3 internal_search · summarizer
TASK         "Write the quarterly customer satisfaction report (2026-Q3)."

L1 · report_writer
    Writes section 1 with the available data: NPS July 42 · August 35 · September 39
    Thought:     before section 2 I need to explain the August drop.
    Calls:       research_assistant("What explains the NPS drop from 42 to 35 in
                 August 2026? Return causes with evidence.")
    Waits for the result

    L2 · research_assistant
        Calls:   internal_search("detractor comments, August 2026")
            L3 · internal_search → 1,180 comments; 38% mention the wait time
        Calls:   internal_search("average phone line wait time, July and August 2026")
            L3 · internal_search → July 4 min · August 11 min
        Calls:   summarizer(results of the two searches)
            L3 · summarizer → the drop coincides with the increase in wait time
        Returns to L1:
            Main cause: the wait time went from 4 to 11 minutes.
            Evidence: 38% of 1,180 detractor comments mention it.

L1 · report_writer (continues)
    Writes section 2 with the cause and evidence received.
    Writes section 3: the recovery to 39 in September and recommendations.

RESULT       three-section report; the detailed search stayed in L2's context
```

**Reading the trace**

- **Who decides:** L1 decides what to ask and when; L2 decides how to investigate.
- **What it shows:** unlike routing, L1 delegated only part of its task and kept writing with the result. The L3 searches did not take up L1's context window.
- **Counterpoint (Cognition):** L1 keeps the thread and the state, and L2 answers a scoped question, the structure Yan (2026) describes as the one that works. Each level is a context transfer: if L2 had returned only "wait time", without the evidence, L1 could not support section 2.

---

## 10. Magentic

An SRE manager builds a task ledger, consults specialists and changes the plan when the diagnosis rules out its initial hypothesis. An action on production requires human approval.

```text
PATTERN      Magentic
MANAGER      sre_manager
SPECIALISTS
    diagnostics      logs and metrics (read-only)
    infrastructure   system status and recovery options (CLI)
    rollback         deployment rollback (Git, CLI)
    communications   notices to stakeholders (messaging API)
INCIDENT     09:12 · error rate of the orders service: 23% (threshold: 2%)

TASK LEDGER v1 (09:13)
    Goal: restore the orders service
    T1 Identify the cause                              pending
    T2 Roll back the 08:55 deployment (v4.18)          pending (initial hypothesis)
    T3 Post a notice in the incidents channel          pending

ITERATION 1
    manager → communications: initial notice
        Observation: notice posted in #incidents
    manager → diagnostics: "Analyze logs and metrics since 08:45"
        Observation: "too many connections" errors in the orders database
                     since 09:05; deployment v4.18 did not change data access

TASK LEDGER v2 (09:18)
    T1 Identify the cause                    in progress: connections exhausted
    T2 Roll back deployment v4.18            DISCARDED (unrelated to the cause)
    T3 Post a notice in the incidents channel completed
    T4 Restore connectivity to the DB        new

ITERATION 2
    manager → infrastructure: connection pool status
        Observation: pool at 200 of 200; the RPT-NIGHTLY process opened 140 connections at 09:04
        Options:     (a) stop RPT-NIGHTLY · (b) expand the pool to 300
    manager: proposes (a) because it is reversible; it affects production → requires approval
    APPROVAL · on-call engineer Mariana T.: approved (09:24)
    manager → infrastructure: stop RPT-NIGHTLY
        Observation: pool at 64 of 200 · error rate 0.8% at 09:27

ITERATION 3
    manager → communications: recovery notice
        Observation: notice posted in #incidents

TASK LEDGER v3 (09:30)
    T1 completed · T2 discarded · T3 completed · T4 completed
    T5 Review why RPT-NIGHTLY ran during business hours   assigned to a person

EVALUATION · was the goal met? Yes → end
DURATION     18 minutes · full ledger available for the post-incident review
```

**Reading the trace**

- **Who decides:** the manager plans, assigns and reorders the tasks; a person approves the action on production.
- **What it shows:** the plan changed from rolling back the deployment to restoring the database. The task ledger documents why T2 was discarded.
- **Counterpoint (Cognition):** a single manager centralizes the decisions in the ledger. The risk lies in the actions on external systems, which carry implicit decisions; that is why stopping the process went through approval and was recorded.

---

## 11. Evaluator-optimizer and maker-checker

A translator agent proposes a version and an evaluator agent reviews it against three criteria. The evaluator returns specific feedback until it approves or the iteration limit is reached. The original text is a fragment written for this example.

```text
PATTERN      Evaluator-optimizer (maker-checker)
TASK         Translate a Spanish literary fragment into English
EVALUATOR CRITERIA
    C1 fidelity of meaning · C2 preserves the main image · C3 literary register
LIMIT        3 iterations; when reached, escalate to a person

ORIGINAL
    "La tarde se deshizo sobre los tejados como una promesa que nadie había pedido."

ITERATION 1
    Translator (receives: original + criteria)
        "The afternoon fell apart over the roofs like a promise nobody asked for."
    Evaluator (receives: original + criteria + version 1)
        C1 ✔
        C2 ✘ "fell apart" suggests breaking; "se deshizo" suggests a gradual dissolving.
        C3 ✘ "nobody asked for" is colloquial; the original uses the pluperfect.
        Verdict: revise

ITERATION 2
    Translator (receives: original + version 1 + feedback)
        "The evening dissolved over the rooftops like a promise no one had asked for."
    Evaluator
        C1 ✔
        C2 ✔ "dissolved" preserves the gradual dissolving.
        C3 ✔ "no one had asked for" keeps the pluperfect and the register.
        Note: "evening" translates "tarde" in its sense of the sun going down.
        Verdict: approved

RESULT       version 2, approved in 2 of 3 iterations
```

**Reading the trace**

- **Who decides:** the evaluator decides whether the version passes; the iteration limit decides when to escalate.
- **What it shows:** the pattern fits because feedback visibly improves the translation and the evaluator can articulate it, the two signals Anthropic mentions.
- **Counterpoint (Cognition):** the translator and the evaluator take turns on the same text. The evaluator receives the original in addition to each version; without it, it would evaluate how natural the English sounds rather than its fidelity.

---

## 12. Generator-critic

A generator writes a SQL query and a critic validates it against the schema and three rules. The cycle is pass or fail and ends when the critic approves.

```text
PATTERN      Generator-critic
SCHEMA
    orders(id, customer_id, date TIMESTAMP, total)
    customers(id, name, region)
REQUEST      "Total sales by region in September 2026, from highest to lowest."
CRITIC       programmatic validator with three rules
    R1 the columns exist in the schema
    R2 every non-aggregated column appears in GROUP BY
    R3 date ranges on TIMESTAMP are half-open (>= start and < end)
OUTPUT       "PASS" or list of errors

ITERATION 1
    Generator
        SELECT c.region, SUM(o.amount)
        FROM orders o JOIN customers c ON o.customer_id = c.id
        WHERE o.date BETWEEN '2026-09-01' AND '2026-09-30'
        ORDER BY 2 DESC;
    Critic → FAIL
        R1 the column o.amount does not exist; the column is called total
        R2 c.region requires GROUP BY c.region
        R3 BETWEEN excludes orders on September 30 after 00:00:00

ITERATION 2
    Generator (receives: request + schema + query 1 + errors)
        SELECT c.region, SUM(o.total) AS total_sales
        FROM orders o JOIN customers c ON o.customer_id = c.id
        WHERE o.date >= '2026-09-01' AND o.date < '2026-10-01'
        GROUP BY c.region
        ORDER BY total_sales DESC;
    Critic → PASS

RESULT       query 2, approved in iteration 2
```

**Reading the trace**

- **Who decides:** the critic decides with verifiable rules; the generator decides how to fix.
- **What it shows:** the focus is correctness. Each error has a rule that detects it, and the answer is pass or fail.
- **Counterpoint (Cognition):** the critic is a program, not an LLM. A deterministic check always applies the same rule and does not introduce interpretations of its own.

---

## 13. Iterative refinement

A generator writes a function, a critic writes improvement notes and a refiner rewrites the code. In the first iteration, the refiner introduces a change nobody asked for, and the critic detects it in the second.

````text
PATTERN      Iterative refinement
GOAL         Function that returns the 10 customers with the most orders, as [[customer_id, count], ...]
THRESHOLD    the critic reports no medium or high severity notes
LIMIT        3 iterations

GENERATOR · draft v1
    def top_customers(orders):
        counts = []
        for o in orders:
            found = False
            for c in counts:
                if c[0] == o["customer_id"]:
                    c[1] += 1
                    found = True
            if not found:
                counts.append([o["customer_id"], 1])
        counts.sort(key=lambda c: c[1], reverse=True)
        return counts[:10]

ITERATION 1
    Critic → notes
        High:   the linear search inside the loop costs O(n × k) for n orders and k customers.
        Medium: the whole list is sorted to get only 10 elements.
    Refiner → v2
        from collections import Counter
        def top_customers(orders):
            return Counter(o["customer_id"] for o in orders).most_common(10)

ITERATION 2
    Critic → notes
        Medium: the return type changed from a list of lists to a list of tuples;
                code that modifies c[1] in the result would fail.
    Refiner → v3
        from collections import Counter
        def top_customers(orders):
            counts = Counter(o["customer_id"] for o in orders)
            return [[customer, n] for customer, n in counts.most_common(10)]

ITERATION 3
    Critic → notes
        Low: add type annotations.
    Exit signal: threshold reached (no medium or high notes)

RESULT       v3, accepted in iteration 3 of 3
````

**Reading the trace**

- **Who decides:** the critic defines what to improve and the exit condition decides when to stop.
- **What it shows:** unlike generator-critic, the critic delivers improvement notes with severity, not a pass or fail. The cycle ended upon reaching the threshold, right at the iteration limit.
- **Counterpoint (Cognition):** the type change in v2 is an implicit decision by the refiner, the same problem Cognition describes with editing models. The critic detected it because it receives the original goal, which specifies the output format.

---

## 14. Group chat

Three read-only agents and a department employee evaluate a park proposal in a shared thread. The chat manager decides who speaks and ends the discussion when no participant has objections.

```text
PATTERN      Group chat
CHAT MANAGER moderates the turns · maximum 6 rounds · end: no participant has objections
PARTICIPANTS (read-only)
    community      accessibility and expected use
    environmental  ecological impact and regulations
    budget         construction and operating costs
    person         Ana R., Parks Department
PROPOSAL P-2026-14 · Las Lomas Park (fictitious)
    3.2 ha · artificial turf field · 1.1 km walking path · 120 trees
    construction: $18.5 M MXN · available annual maintenance budget: $1.3 M MXN

ROUND 1
    manager → community
        The walking path has no ramps on the west side, where the elementary school is.
    manager → environmental
        The artificial turf seals 0.7 ha of permeable soil in an area prone to flooding.
    manager → budget
        Annual maintenance with artificial turf: $1.4 M, which includes a $0.4 M reserve
        to replace the turf. It exceeds the $1.3 M budget.

ROUND 2
    manager: asks to evaluate switching to natural grass
    environmental
        Natural grass keeps the soil permeable, but it requires irrigation.
    budget
        Construction drops by $2.1 M. Maintenance removes the $0.4 M reserve and
        adds $0.35 M for care and irrigation: $1.35 M, still above the budget.

ROUND 3
    person (Ana R.)
        The city has an agreement for treated water for irrigation at half the cost.
    budget
        Of the $0.35 M, $0.2 M is irrigation; with treated water it drops to $0.1 M.
        Maintenance: $1.25 M, within the budget.
    community
        Two ramps on the west side cost $0.3 M in construction.

ROUND 4
    manager: summarizes the adjusted proposal
        Natural grass irrigated with treated water · two ramps on the west side
        Construction: 18.5 − 2.1 + 0.3 = $16.7 M · maintenance: $1.25 M per year
    community: no objections · environmental: no objections ·
    budget: no objections · person: no objections
    End criterion met in round 4 of 6

RESULT       adjusted proposal ready for community consultation
```

**Reading the trace**

- **Who decides:** the chat manager decides the turns and applies the objective end criterion; the agents only contribute analysis.
- **What it shows:** the information that unblocked the budget, the treated water agreement, came from the person. The shared thread allowed budget to use it in the same turn.
- **Counterpoint (Cognition):** the group chat served to deliberate, not to build. All participants see the same thread (Principle 1), and since they are read-only, none of them executed changes based on assumptions the others did not know.

---

## 15. Human-in-the-loop

The agent from the ReAct trace about the duplicate charge now has an approval rule limited to one tool. Queries proceed on their own; a refund greater than $100 MXN pauses execution until a person approves it.

```text
PATTERN      Human-in-the-loop
APPROVAL RULE (limited to tools)
    get_payments, get_account_history, search_knowledge_base  → no approval
    request_refund with amount > $100 MXN                     → requires approval
CASE         customer C-1027 reports a duplicate charge for their subscription

ITERATIONS 1 to 3 (no approval)
    get_payments             → P-88310 (Sep 1) and P-88342 (Sep 3), $199 each, different cards
    get_account_history      → payment method changed on Sep 2
    search_knowledge_base    → known error #312: the second charge is refundable

ITERATION 4
    Proposed action: request_refund(payment_id = "P-88342", amount = 199,
                                    reason = "Duplicate charge, error #312")
    Rule:    199 > 100 → requires approval
    PAUSE    the execution state is saved (checkpoint CK-77)

    APPROVAL REQUEST → support supervisor
        Action:     refund of $199 MXN for payment P-88342
        Evidence:   two charges for the same period · card change on Sep 2 ·
                    match with known error #312
        Trace:      link to iterations 1 to 3
    RESPONSE (14 minutes later): approved

    RESUME   from CK-77, without repeating iterations 1 to 3
    Action:      request_refund(payment_id = "P-88342", amount = 199, ...)
    Observation: refund R-5521 created

ITERATION 5
    Final answer to the customer with the cause and reference R-5521

ALTERNATIVE · if the supervisor had responded with feedback
    "First check whether P-88310 already has a partial refund."
    → the feedback goes back to the agent as a new observation and the loop continues
```

**Reading the trace**

- **Who decides:** the approval rule decides when to pause; the supervisor decides whether the action proceeds.
- **What it shows:** approval is limited to one tool and one threshold, so queries do not wait for anyone. The checkpoint allows resuming without repeating work.
- **Counterpoint (Cognition):** the supervisor receives the evidence and the link to the trace, not just "refund $199". With that context, they can approve in minutes and spot anything that doesn't add up.

---

## 16. Composite patterns

A support system combines three patterns: a coordinator routes the message, the technical branch searches the documentation and the customer history in parallel, and a generator-critic loop reviews the tone of the response.

```text
PATTERN      Composite: coordinator/dispatcher → parallel fan-out → generator-critic
MESSAGE (customer C-6195)
    "Since I updated the app my orders don't sync anymore. This is the third time it's happened."

STAGE 1 · COORDINATOR/DISPATCHER
    coordinator: intent = technical problem with the app → app_support branch
    Context transferred: full message + customer id

STAGE 2 · PARALLEL FAN-OUT (app_support branch, read-only)
    docs_search    → article KB-77: version 5.2.0 loses the sync session when
                     updating on Android 14; solution: sign out and sign in
                     again; fix included in 5.2.1
    history_search → Android 14 · app 5.2.0 · previous tickets T-201 (July) and
                     T-344 (August) for syncing, both closed with "reinstall"
    GATHER: diagnosis = defect KB-77; recurrence confirmed (third case)

STAGE 3 · GENERATOR-CRITIC (tone)
    Critic criteria: acknowledges the recurrence · avoids technical terms ·
                     gives a single clear solution step
    Generator v1
        "Your issue corresponds to defect KB-77 in version 5.2.0, which invalidates
        the sync token after the update."
    Critic → FAIL
        uses "issue" and "token" · does not acknowledge it is the third time · gives no clear step
    Generator v2
        "We're sorry this is happening to you for the third time. We found the cause: a bug
        in version 5.2.0. To fix it, sign out of the app and sign back in.
        Version 5.2.1, already available, fixes the bug for good."
    Critic → PASS

FINAL RESPONSE   version v2

CONTEXT TRANSFER POINTS
    1. coordinator → app_support branch
    2. parallel searches → generator
    3. generator ↔ critic
```

**Reading the trace**

- **Who decides:** the coordinator chooses the branch, the design defines the parallel searches and the critic decides whether the tone is appropriate.
- **What it shows:** each stage uses the pattern that suits its task. The history provided a fact, the recurrence, that changed the tone of the response.
- **Counterpoint (Cognition):** the trace ends by listing the three transfer points. At each one, the receiver has what it needs: the generator receives the original message and both results, which is why version 2 mentions that it is the third time.

---

## References

Anthropic. (2024, December 19). *Building effective agents*. [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)

Cognition. (2025, June 12). *Don't build multi-agents* (W. Yan). [https://cognition.com/blog/dont-build-multi-agents](https://cognition.com/blog/dont-build-multi-agents)

Google. (2025, December 16). *Developer's guide to multi-agent patterns in ADK* (S. Saboo). Google Developers Blog. [https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/](https://developers.googleblog.com/developers-guide-to-multi-agent-patterns-in-adk/)

Microsoft. (2026, February 12). *AI agent orchestration patterns* (C. Kittel and C. Siemens). Azure Architecture Center. [https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)

Ramirez, E. (2026). *Function Calling vs. ReAct: example traces* [Course material].

Yan, W. (2026, April 22). *Multi-agents: What's actually working* [Post on X]. [https://x.com/walden_yan/status/2047054554433462360](https://x.com/walden_yan/status/2047054554433462360)
